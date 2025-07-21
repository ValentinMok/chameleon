import React from 'react';
import './WaitingScreen.css';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import PlayersList from '../PlayersList/PlayersList';

const WaitingScreen: React.FC = () => {
    const { gameState } = useGame();
    const { t } = useLanguage();
    const { players, gameId } = gameState;

    return (
        <>
            <h1>🦎 {t('game.waitingRoom')}</h1>
            <p style={{ marginBottom: '2rem' }}>{t('waiting.message')}</p>
            
            <div className="players-section">
                <h3>{t('waiting.playersInGame')} ({players.length})</h3>
                <PlayersList players={players} currentPlayer={gameState.playerName} />
            </div>
            
            <div className="game-code-display">
                <p>{t('waiting.gameCodeLabel')} <strong>{gameId}</strong></p>
            </div>
        </>
    );
}

export default WaitingScreen;