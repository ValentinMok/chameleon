import React from 'react';
import './HostScreen.css';
import { useGame } from '../../contexts/GameContext';
import QRCode from '../QRCode/QRCode';
import PlayersList from '../PlayersList/PlayersList';
import debugLogger from '../../services/debugLogger';

function HostScreen() {
    const { gameState, startGame } = useGame();
    const { players, gameId } = gameState;

    const canStartGame = players.length >= 3;
    const startButtonText = canStartGame 
        ? `Start Game (${players.length} players)` 
        : `Start Game (Need ${3 - players.length} more players)`;

    const addTestPlayers = () => {
        debugLogger.info('Test players feature would be implemented here');
        // In a real implementation, this would add test players for development
    };

    const toggleDebugConsole = () => {
        const event = new CustomEvent('toggleDebugConsole');
        window.dispatchEvent(event);
    };

    return (
        <>
            <h1>🦎 The Chameleon</h1>
            <p style={{ marginBottom: '2rem' }}>
                Set up the game on your phone, then others can join by scanning the QR code!
            </p>
            
            <QRCode gameId={gameId} />
            
            <div className="players-section">
                <h3>Players ({players.length})</h3>
                <PlayersList players={players} />
            </div>
            
            <button 
                onClick={startGame} 
                disabled={!canStartGame}
            >
                {startButtonText}
            </button>
            
            <button 
                onClick={addTestPlayers}
                className="secondary-button"
            >
                Add Test Players
            </button>
            
            <button 
                onClick={toggleDebugConsole}
                className="debug-button"
            >
                🐛 Debug Console
            </button>
        </>
    );
}

export default HostScreen;