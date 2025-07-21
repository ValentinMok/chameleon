import { DebugLog } from '../types';

class DebugLogger {
    private logs: DebugLog[];
    private listeners: ((log: DebugLog | null) => void)[];

    constructor() {
        this.logs = [];
        this.listeners = [];
    }

    log(message: string, type: 'info' | 'error' | 'success' = 'info'): void {
        const log: DebugLog = {
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

    error(message: string): void {
        this.log(message, 'error');
    }

    success(message: string): void {
        this.log(message, 'success');
    }

    info(message: string): void {
        this.log(message, 'info');
    }

    clear(): void {
        this.logs = [];
        this.listeners.forEach(listener => listener(null));
    }

    subscribe(callback: (log: DebugLog | null) => void): () => void {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(l => l !== callback);
        };
    }

    getLogs(): DebugLog[] {
        return this.logs;
    }
}

// Create singleton instance
const debugLogger = new DebugLogger();

export default debugLogger;