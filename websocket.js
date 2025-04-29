// WebSocket connection handler
class SecurityWebSocket {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 3000;
        this.eventListeners = {
            'message': [],
            'open': [],
            'close': [],
            'error': [],
        };
        
        this.connect();
    }
    
    connect() {
        try {
            this.socket = new WebSocket(this.url);
            
            this.socket.onopen = (event) => {
                console.log('WebSocket connection established');
                this.isConnected = true;
                this.reconnectAttempts = 0;
                this.updateStatusUI(true);
                this._triggerEvent('open', event);
            };
            
            this.socket.onmessage = (event) => {
                // Parse the incoming message
                try {
                    const data = JSON.parse(event.data);
                    this._triggerEvent('message', data);
                } catch (error) {
                    console.error('Error parsing WebSocket message:', error);
                }
            };
            
            this.socket.onclose = (event) => {
                console.log('WebSocket connection closed');
                this.isConnected = false;
                this.updateStatusUI(false);
                this._triggerEvent('close', event);
                
                // Attempt to reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    this.reconnectAttempts++;
                    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
                    
                    setTimeout(() => {
                        this.connect();
                    }, this.reconnectDelay);
                }
            };
            
            this.socket.onerror = (error) => {
                console.error('WebSocket error:', error);
                this._triggerEvent('error', error);
            };
        } catch (error) {
            console.error('Error creating WebSocket connection:', error);
        }
    }
    
    updateStatusUI(isConnected) {
        const statusIndicator = document.getElementById('status-indicator');
        const statusText = document.getElementById('status-text');
        
        if (isConnected) {
            statusIndicator.className = 'connected';
            statusText.textContent = 'Terhubung';
        } else {
            statusIndicator.className = 'disconnected';
            statusText.textContent = 'Terputus - mencoba menghubungkan kembali...';
        }
    }
    
    on(eventType, callback) {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].push(callback);
        }
    }
    
    _triggerEvent(eventType, data) {
        if (this.eventListeners[eventType]) {
            this.eventListeners[eventType].forEach(callback => {
                callback(data);
            });
        }
    }
    
    send(data) {
        if (this.isConnected && this.socket) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error('Cannot send message: WebSocket not connected');
        }
    }
    
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }
}

// Create a global instance of the WebSocket connection
const securityWS = new SecurityWebSocket('ws://localhost:8080');