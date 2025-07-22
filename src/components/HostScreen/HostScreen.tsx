import React from 'react';
import './HostScreen.css';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import QRCode from '../QRCode/QRCode';
import PlayersList from '../PlayersList/PlayersList';

const HostScreen: React.FC = () => {
    const { gameState, startGame } = useGame();
    const { t } = useLanguage();
    const { players, gameId } = gameState;

    const canStartGame = players.length >= 3;
    const startButtonText = canStartGame 
        ? t('host.startGamePlayers').replace('{count}', players.length.toString())
        : t('host.needMorePlayers').replace('{count}', (3 - players.length).toString());

    const toggleDebugConsole = () => {
        const event = new CustomEvent('toggleDebugConsole');
        window.dispatchEvent(event);
    };

    return (
        <>
            <h1>🦎 {t('game.title')}</h1>
            
            <QRCode gameId={gameId} />
            
            <div className="players-section">
                <h3>{t('host.players')} ({players.length})</h3>
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
                {t('host.debugConsole')}
            </button>
        </>
    );
}

export default HostScreen;
