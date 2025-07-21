import React from 'react';
import './HostScreen.css';
import { useGame } from '../../contexts/GameContext';
import QRCode from '../QRCode/QRCode';
import PlayersList from '../PlayersList/PlayersList';

const HostScreen: React.FC = () => {
    const { gameState, startGame } = useGame();
    const { players, gameId } = gameState;

    const canStartGame = players.length >= 3;
    const startButtonText = canStartGame 
        ? `Start Game (${players.length} players)` 
        : `Start Game (Need ${3 - players.length} more players)`;

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
                <PlayersList players={players} currentPlayer={gameState.playerName} />
            </div>
            
            <button 
                onClick={startGame} 
                disabled={!canStartGame}
            >
                {startButtonText}
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