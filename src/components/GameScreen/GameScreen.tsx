import React from 'react';
import './GameScreen.css';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { chameleonTopics } from '../../data/chameleonTopics';

const GameScreen: React.FC = () => {
    const { gameState, startNewRound } = useGame();
    const { t } = useLanguage();
    const { 
        isHost, 
        playerName, 
        players, 
        chameleonIndex, 
        currentWord, 
        currentTopic 
    } = gameState;

    // Determine if current player is the chameleon
    const playerIndex = players.findIndex(p => p.name === playerName);
    const isPlayerChameleon = playerIndex === chameleonIndex;

    return (
        <>
            <h1>🦎 {t('game.title')}</h1>
            
            <div className="game-info">
                <div className={`role-display ${isPlayerChameleon ? 'chameleon' : 'regular'}`}>
                    {isPlayerChameleon 
                        ? t('game.chameleon')
                        : t('game.regularPlayer')}
                </div>
                
                {!isPlayerChameleon ? (
                    <div id="wordSection">
                        <div className="topic-header">{t('game.topic')} <span>{currentTopic}</span></div>
                        <div className="word-grid">
                            {chameleonTopics[currentTopic]?.map((word, index) => (
                                <div 
                                    key={index} 
                                    className={`word-item ${word === currentWord ? 'secret' : ''}`}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div id="topicSection">
                        <div className="chameleon-topic-only">
                            <div className="topic-label">{t('game.topicOnly')}</div>
                            <div className="topic-value">{currentTopic}</div>
                        </div>
                    </div>
                )}
            </div>
            
            {isHost && (
                <button onClick={startNewRound} className="host-only">
                    {t('game.startNewRound')}
                </button>
            )}
        </>
    );
}

export default GameScreen;