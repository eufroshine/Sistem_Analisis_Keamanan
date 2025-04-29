// Main application logic for the security analysis dashboard
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global application state
    const appState = {
        totalAttacks: 0,
        attacksPerMinute: 0,
        attackHistory: [],
        severityLevel: 'Rendah',
        logs: [],
        filters: {
            severity: 'all',
            attackType: 'all'
        }
    };
    
    // DOM elements
    const elements = {
        totalAttacks: document.getElementById('total-attacks'),
        attacksPerMinute: document.getElementById('attacks-per-minute'),
        severityLevel: document.getElementById('severity-level'),
        logContainer: document.getElementById('log-container'),
        severityFilter: document.getElementById('severity-filter'),
        attackTypeFilter: document.getElementById('attack-type-filter'),
        clearLogsBtn: document.getElementById('clear-logs'),
        attackChart: document.getElementById('attack-chart')
    };
    
    // Attack type labels
    const attackTypes = {
        'sql': 'SQL Injection',
        'xss': 'Cross-Site Scripting',
        'dos': 'Denial of Service',
        'brute': 'Brute Force',
        'csrf': 'Cross-Site Request Forgery',
        'file': 'File Inclusion',
        'command': 'Command Injection',
        'other': 'Lainnya'
    };
    
    // Initialize Chart.js
    const chartCtx = elements.attackChart.getContext('2d');
    const attackChart = new Chart(chartCtx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Serangan per Menit',
                backgroundColor: 'rgba(46, 204, 113, 0.2)',
                borderColor: 'rgba(46, 204, 113, 1)',
                data: [],
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Jumlah Serangan'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Waktu'
                    }
                }
            }
        }
    });
    
    // Event listeners
    elements.severityFilter.addEventListener('change', applyFilters);
    elements.attackTypeFilter.addEventListener('change', applyFilters);
    elements.clearLogsBtn.addEventListener('click', clearLogs);
    
    // WebSocket message handler
    securityWS.on('message', handleIncomingAttack);
    
    // Process incoming attack data
    function handleIncomingAttack(data) {
        // Pass incoming data to WebAssembly for analysis
        wasmModule.analyzeAttack(data).then(analysisResult => {
            // Update attack count
            appState.totalAttacks++;
            elements.totalAttacks.textContent = appState.totalAttacks;
            
            // Add to logs with analysis result
            const attackEntry = {
                ...data,
                timestamp: new Date(),
                analysisResult
            };
            
            appState.logs.unshift(attackEntry);
            
            // Keep only last 100 logs in memory
            if (appState.logs.length > 100) {
                appState.logs.pop();
            }
            
            // Update attack rate
            calculateAttackRate();
            
            // Update severity level
            updateSeverityLevel();
            
            // Update chart
            updateChart();
            
            // Refresh UI with new data
            renderLogs();
        });
    }
    
    // Calculate attacks per minute based on recent history
    function calculateAttackRate() {
        const now = new Date();
        const oneMinuteAgo = new Date(now - 60000);
        
        // Keep only attacks in the last minute
        appState.attackHistory = appState.attackHistory.filter(time => time > oneMinuteAgo);
        
        // Add the current attack
        appState.attackHistory.push(now);
        
        // Calculate attacks per minute
        appState.attacksPerMinute = appState.attackHistory.length;
        elements.attacksPerMinute.textContent = appState.attacksPerMinute;
    }
    
    // Update overall system severity level based on recent activity
    function updateSeverityLevel() {
        let newLevel;
        
        if (appState.attacksPerMinute >= 50) {
            newLevel = 'Kritis';
            elements.severityLevel.style.color = '#e74c3c';
        } else if (appState.attacksPerMinute >= 20) {
            newLevel = 'Tinggi';
            elements.severityLevel.style.color = '#e74c3c';
        } else if (appState.attacksPerMinute >= 5) {
            newLevel = 'Sedang';
            elements.severityLevel.style.color = '#f39c12';
        } else {
            newLevel = 'Rendah';
            elements.severityLevel.style.color = '#2ecc71';
        }
        
        appState.severityLevel = newLevel;
        elements.severityLevel.textContent = newLevel;
    }
    
    // Update the chart with new data
    function updateChart() {
        const now = new Date();
        const label = now.toLocaleTimeString();
        
        // Add new data point
        if (attackChart.data.labels.length >= 10) {
            attackChart.data.labels.shift();
            attackChart.data.datasets[0].data.shift();
        }
        
        attackChart.data.labels.push(label);
        attackChart.data.datasets[0].data.push(appState.attacksPerMinute);
        attackChart.update();
    }
    
    // Apply filters to logs
    function applyFilters() {
        // Update filter state
        appState.filters.severity = elements.severityFilter.value;
        appState.filters.attackType = elements.attackTypeFilter.value;
        
        // Re-render logs with new filters
        renderLogs();
    }
    
    // Render log entries to DOM
    function renderLogs() {
        // Clear current logs
        elements.logContainer.innerHTML = '';
        
        // Filter logs according to current filters
        const filteredLogs = appState.logs.filter(log => {
            const severityMatch = appState.filters.severity === 'all' || log.severity === appState.filters.severity;
            const typeMatch = appState.filters.attackType === 'all' || log.type === appState.filters.attackType;
            return severityMatch && typeMatch;
        });
        
        // Create log entry elements
        filteredLogs.forEach(log => {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry severity-${log.severity}`;
            
            const timestamp = document.createElement('span');
            timestamp.className = 'log-timestamp';
            timestamp.textContent = log.timestamp.toLocaleTimeString();
            
            const message = document.createElement('span');
            message.className = 'log-message';
            
            // Format message with attack type
            const attackTypeName = attackTypes[log.type] || attackTypes.other;
            message.innerHTML = `<span class="attack-type">[${attackTypeName}]</span> ${log.message}`;
            
            const severity = document.createElement('span');
            severity.className = `log-severity severity-${log.severity}`;
            severity.textContent = log.severity.charAt(0).toUpperCase() + log.severity.slice(1);
            
            logEntry.appendChild(timestamp);
            logEntry.appendChild(message);
            logEntry.appendChild(severity);
            
            elements.logContainer.appendChild(logEntry);
        });
        
        // Show message if no logs match filters
        if (filteredLogs.length === 0) {
            const noLogs = document.createElement('div');
            noLogs.className = 'no-logs';
            noLogs.textContent = 'Tidak ada log yang sesuai dengan filter.';
            elements.logContainer.appendChild(noLogs);
        }
    }
    
    // Clear all logs
    function clearLogs() {
        appState.logs = [];
        renderLogs();
    }
    
    // Simulate incoming attacks for testing
    function simulateAttacks() {
        const attackTypes = ['sql', 'xss', 'dos', 'brute', 'csrf', 'file', 'command'];
        const severityLevels = ['low', 'medium', 'high', 'critical'];
        
        const randomAttack = {
            timestamp: new Date(),
            type: attackTypes[Math.floor(Math.random() * attackTypes.length)],
            severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
            source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            target: `/api/users/${Math.floor(Math.random() * 1000)}`,
            message: `Percobaan serangan terdeteksi dari IP: 192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
        };
        
        // Simulate WebSocket message
        handleIncomingAttack(randomAttack);
    }
    
    // For demo purposes only - simulate attacks every few seconds
    setInterval(simulateAttacks, 2000 + Math.random() * 3000);
    
    // Initial render
    renderLogs();
});