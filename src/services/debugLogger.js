class DebugLogger {
    constructor() {
        this.logs = [];
        this.listeners = [];
    }

    log(message, type = 'info') {
        const log = {
            message,
            type,
            timestamp: new Date().toLocaleTimeString()
        };
        
        this.logs.push(log);
        
        // Also log to browser console
        console.log(`[${type.toUpperCase()}]`, message);
        
        // Notify listeners
        this.listeners.forEach(listener => listener(log));
    }

    error(message) {
        this.log(message, 'error');
    }

    success(message) {
        this.log(message, 'success');
    }

    info(message) {
        this.log(message, 'info');
    }

    clear() {
        this.logs = [];
        this.listeners.forEach(listener => listener(null));
    }

    subscribe(callback) {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    getLogs() {
        return this.logs;
    }
}

// Create singleton instance
const debugLogger = new DebugLogger();

export default debugLogger;