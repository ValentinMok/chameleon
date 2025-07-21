import React, { useState, useEffect } from 'react';
import './JoinScreen.css';
import { useGame } from '../../contexts/GameContext';
import { getGameIdFromUrl } from '../../utils/gameUtils';

function JoinScreen() {
    const [playerName, setPlayerName] = useState('');
    const { joinGame } = useGame();

    useEffect(() => {
        // Focus on name input when component mounts
        const timer = setTimeout(() => {
            const input = document.getElementById('playerName');
            if (input) input.focus();
        }, 100);
        
        return () => clearTimeout(timer);
    }, []);

    const handleJoin = async () => {
        const name = playerName.trim();
        
        if (!name) {
            // This will be handled by the notification system
            return;
        }
        
        const gameId = getGameIdFromUrl();
        if (gameId) {
            await joinGame(gameId, name);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleJoin();
        }
    };

    return (
        <>
            <h1>🦎 Join The Chameleon</h1>
            <p style={{ marginBottom: '2rem' }}>Enter your name to join the game</p>
            
            <input
                type="text"
                id="playerName"
                placeholder="Enter your name"
                maxLength={20}
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <br />
            <button onClick={handleJoin}>Join Game</button>
        </>
    );
}

export default JoinScreen;