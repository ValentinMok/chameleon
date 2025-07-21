import React from 'react';
import './GameScreen.css';
import { useGame } from '../../contexts/GameContext';
import { chameleonTopics } from '../../data/chameleonTopics';

function GameScreen() {
    const { gameState, startNewRound, endGame } = useGame();
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
            <h1>🦎 The Chameleon</h1>
            
            <div className="game-info">
                <div className={`role-display ${isPlayerChameleon ? 'chameleon' : 'regular'}`}>
                    {isPlayerChameleon 
                        ? 'You are the CHAMELEON! 🦎' 
                        : 'You are a REGULAR PLAYER 🕵️'}
                </div>
                
                {!isPlayerChameleon ? (
                    <div id="wordSection">
                        <div className="topic-header">Topic: <span>{currentTopic}</span></div>
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
                        <div className="chameleon-info">
                            <div className="topic-header">Topic</div>
                            <div className="topic-display">{currentTopic}</div>
                            <div className="chameleon-instructions">
                                Listen carefully and blend in without knowing the secret word
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {isHost && (
                <button onClick={startNewRound} className="host-only">
                    Start New Round
                </button>
            )}
            
            <button onClick={endGame} className="end-game-button">
                Leave Game
            </button>
        </>
    );
}

export default GameScreen;