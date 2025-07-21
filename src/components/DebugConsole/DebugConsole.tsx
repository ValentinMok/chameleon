import React, { useState, useEffect, useRef } from 'react';
import './DebugConsole.css';
import debugLogger from '../../services/debugLogger';
import { DebugLog } from '../../types';

const DebugConsole: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [logs, setLogs] = useState<DebugLog[]>([]);
    const outputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Subscribe to debug logger
        const unsubscribe = debugLogger.subscribe((newLog: DebugLog | null) => {
            if (newLog === null) {
                // Clear logs
                setLogs([]);
            } else {
                setLogs(prev => [...prev, newLog]);
            }
        });

        // Initialize with existing logs
        setLogs(debugLogger.getLogs());

        // Listen for toggle event
        const handleToggle = () => setIsVisible(prev => !prev);
        window.addEventListener('toggleDebugConsole', handleToggle);

        return () => {
            unsubscribe();
            window.removeEventListener('toggleDebugConsole', handleToggle);
        };
    }, []);

    useEffect(() => {
        // Auto-scroll to bottom when new logs are added
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [logs]);

    const clearConsole = () => {
        debugLogger.clear();
    };

    const toggleConsole = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="debug-console">
            <div className="debug-header">
                <h4>Debug Console</h4>
                <div>
                    <button onClick={clearConsole}>Clear</button>
                    <button onClick={toggleConsole}>×</button>
                </div>
            </div>
            <div className="debug-output" ref={outputRef}>
                {logs.map((log, index) => (
                    <div key={index} className={`debug-log ${log.type}`}>
                        [{log.timestamp}] {log.message}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DebugConsole;