const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create simple HTTP server
const server = http.createServer((req, res) => {
    let filePath;
    
    // Serve static files
    if (req.url === '/' || req.url === '/index.html') {
        filePath = path.join(__dirname, 'index.html');
    } else {
        filePath = path.join(__dirname, req.url);
    }
    
    // Determine content type based on file extension
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.wasm':
            contentType = 'application/wasm';
            break;
    }
    
    // Read the file
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // Page not found
                res.writeHead(404);
                res.end('File not found');
            } else {
                // Server error
                res.writeHead(500);
                res.end(`Server Error: ${error.code}`);
            }
        } else {
            // Success
            res.writeHead(200, { 'Content-Type': contentType });

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
const clients = new Set();

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('Client connected');
    clients.add(ws);
    
    // Send welcome message
    ws.send(JSON.stringify({
        type: 'info',
        severity: 'low',
        message: 'Terhubung ke server analisis keamanan',
        timestamp: new Date()
    }));
    
    // Handle client messages
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            console.log('Received:', data);
            
            // Process client message if needed
            // For example, if clients can configure monitoring settings
            if (data.type === 'config') {
                // Handle configuration change
                console.log('Client updated configuration:', data.config);
            }
            
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
    
    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

// Function to broadcast message to all connected clients
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// Simulate security events for testing purposes
function simulateSecurityEvents() {
    // Attack types
    const attackTypes = ['sql', 'xss', 'dos', 'brute', 'csrf', 'file', 'command'];
    // Severity levels
    const severityLevels = ['low', 'medium', 'high', 'critical'];
    // Sample targets
    const targets = [
        '/api/users/login',
        '/api/admin/settings',
        '/api/payments/process',
        '/user/profile',
        '/admin/dashboard',
        '/api/orders/create'
    ];
    
    // Generate random IP
    const randomIP = () => {
        return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    };
    
    // Generate random event
    setInterval(() => {
        // Only generate events if clients are connected
        if (clients.size > 0) {
            const attackType = attackTypes[Math.floor(Math.random() * attackTypes.length)];
            const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
            const target = targets[Math.floor(Math.random() * targets.length)];
            const sourceIP = randomIP();
            
            // Create attack message
            let message = '';
            switch (attackType) {
                case 'sql':
                    message = `SQL Injection mencurigakan terdeteksi di ${target}`;
                    break;
                case 'xss':
                    message = `Upaya Cross-Site Scripting terdeteksi di ${target}`;
                    break;
                case 'dos':
                    message = `Kemungkinan serangan DoS terdeteksi dari IP ${sourceIP}`;
                    break;
                case 'brute':
                    message = `Percobaan brute force terdeteksi pada form login`;
                    break;
                case 'csrf':
                    message = `Potensi serangan CSRF terdeteksi di ${target}`;
                    break;
                case 'file':
                    message = `Percobaan file inclusion terdeteksi di ${target}`;
                    break;
                case 'command':
                    message = `Percobaan command injection terdeteksi di ${target}`;
                    break;
                default:
                    message = `Serangan tidak dikenal terdeteksi dari ${sourceIP}`;
            }
            
            // Build the security event
            const securityEvent = {
                type: attackType,
                severity: severity,
                message: message,
                source_ip: sourceIP,
                target: target,
                timestamp: new Date().toISOString()
            };
            
            // Broadcast to all clients
            broadcast(securityEvent);
        }
    }, 3000 + Math.floor(Math.random() * 2000)); // Random interval between 3-5 seconds
}

// Start the server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log(`WebSocket server aktif di ws://localhost:${PORT}`);
    
    // Start simulating security events
    simulateSecurityEvents();
});
            res.end(content, 'utf-8');
        }
    });
});