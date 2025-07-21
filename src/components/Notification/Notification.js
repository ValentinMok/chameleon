import React, { useEffect, useState } from 'react';
import './Notification.css';
import { useGame } from '../../contexts/GameContext';

function Notification() {
    const { notification } = useGame();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (notification) {
            setVisible(true);
            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!notification || !visible) return null;

    return (
        <div className={`notification ${notification.type} ${visible ? 'show' : ''}`}>
            {notification.message}
        </div>
    );
}

export default Notification;