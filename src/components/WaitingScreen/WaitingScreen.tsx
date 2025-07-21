import React from 'react';
import './WaitingScreen.css';
import { useGame } from '../../contexts/GameContext';
import PlayersList from '../PlayersList/PlayersList';

const WaitingScreen: React.FC = () => {
    const { gameState, leaveGame } = useGame();
    const { players, gameId } = gameState;

    return (
        <>
            <h1>🦎 Waiting Room</h1>
            <p style={{ marginBottom: '2rem' }}>Waiting for host to start the game...</p>
            
            <div className="players-section">
                <h3>Players in Game ({players.length})</h3>
                <PlayersList players={players} currentPlayer={gameState.playerName} />
            </div>
            
            <div className="game-code-display">
                <p>Game Code: <strong>{gameId}</strong></p>
            </div>
            
            <button onClick={leaveGame} className="leave-button">
                Leave Game
            </button>
        </>
    );
}

export default WaitingScreen;