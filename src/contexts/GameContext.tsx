import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import gameStorage from '../services/gameStorage';
import debugLogger from '../services/debugLogger';
import { generateGameId, selectRandomChameleon, selectRandomTopicAndWord } from '../utils/gameUtils';
import { chameleonTopics } from '../data/chameleonTopics';
import { GameState, Notification, GameContextType, GameData } from '../types';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = (): GameContextType => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

interface GameProviderProps {
    children: ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
    const [gameState, setGameState] = useState<GameState>({
        isHost: false,
        playerName: '',
        chameleonIndex: -1,
        currentWord: '',
        currentTopic: '',
        gameId: '',
        gameStarted: false,
        players: [],
        screen: 'host' // host, join, waiting, game
    });

    const [notification, setNotification] = useState<Notification | null>(null);
    const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null);

    const showNotification = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    }, []);

    const setupHost = useCallback(async () => {
        const gameId = generateGameId();
        
        setGameState(prev => ({
            ...prev,
            isHost: true,
            playerName: 'Host',
            gameId,
            players: [{name: 'Host', isHost: true}],
            screen: 'host'
        }));

        try {
            await gameStorage.createGame(gameId, 'Host');
            
            // Start listening for players
            const unsub = gameStorage.listenToGame(gameId, (game: GameData | null) => {
                if (game) {
                    setGameState(prev => ({
                        ...prev,
                        players: game.players || [],
                        gameStarted: game.started,
                        chameleonIndex: game.chameleonIndex,
                        currentWord: game.currentWord,
                        currentTopic: game.currentTopic
                    }));
                }
            });
            
            setUnsubscribe(() => unsub);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            showNotification('Error creating game: ' + errorMessage, 'error');
        }
    }, [showNotification]);

    const joinGame = useCallback(async (gameId: string, playerName: string) => {
        try {
            const joined = await gameStorage.addPlayer(gameId, playerName);
            
            if (joined) {
                setGameState(prev => ({
                    ...prev,
                    playerName,
                    gameId,
                    screen: 'waiting'
                }));
                
                // Start listening for game updates
                const unsub = gameStorage.listenToGame(gameId, (game: GameData | null) => {
                    if (!game) {
                        showNotification('Game no longer exists', 'error');
                        setTimeout(() => window.location.reload(), 2000);
                        return;
                    }
                    
                    setGameState(prev => ({
                        ...prev,
                        players: game.players || [],
                        gameStarted: game.started,
                        chameleonIndex: game.chameleonIndex,
                        currentWord: game.currentWord,
                        currentTopic: game.currentTopic,
                        screen: game.started ? 'game' : prev.screen
                    }));
                });
                
                setUnsubscribe(() => unsub);
                showNotification('Successfully joined the game!', 'success');
                return true;
            } else {
                showNotification('Could not join - game may have started or name taken', 'error');
                return false;
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage === 'Game not found') {
                showNotification('Game not found. Check the game code.', 'error');
            } else {
                showNotification('Error joining game: ' + errorMessage, 'error');
            }
            return false;
        }
    }, [showNotification]);

    const startGame = useCallback(async () => {
        if (gameState.players.length < 3) return;
        
        const { topic, word } = selectRandomTopicAndWord(chameleonTopics);
        const chameleonIndex = selectRandomChameleon(gameState.players.length);
        
        try {
            await gameStorage.updateGame(gameState.gameId, {
                started: true,
                chameleonIndex,
                currentWord: word,
                currentTopic: topic
            });
            
            setGameState(prev => ({
                ...prev,
                gameStarted: true,
                chameleonIndex,
                currentWord: word,
                currentTopic: topic,
                screen: 'game'
            }));
            
            debugLogger.success('Game started successfully');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            showNotification('Error starting game: ' + errorMessage, 'error');
        }
    }, [gameState.players.length, gameState.gameId, showNotification]);

    const startNewRound = useCallback(async () => {
        if (!gameState.isHost) return;
        
        const { topic, word } = selectRandomTopicAndWord(chameleonTopics);
        const chameleonIndex = selectRandomChameleon(gameState.players.length);
        
        try {
            await gameStorage.updateGame(gameState.gameId, {
                chameleonIndex,
                currentWord: word,
                currentTopic: topic
            });
            
            showNotification('New round started!', 'info');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            showNotification('Error starting new round: ' + errorMessage, 'error');
        }
    }, [gameState.isHost, gameState.players.length, gameState.gameId, showNotification]);

    const endGame = useCallback(async () => {
        if (unsubscribe) {
            unsubscribe();
        }
        
        if (gameState.isHost) {
            try {
                await gameStorage.updateGame(gameState.gameId, {
                    started: false,
                    chameleonIndex: -1,
                    currentWord: '',
                    currentTopic: ''
                });
                
                setGameState(prev => ({
                    ...prev,
                    gameStarted: false,
                    chameleonIndex: -1,
                    currentWord: '',
                    currentTopic: '',
                    screen: 'host'
                }));
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                debugLogger.error('Error ending game: ' + errorMessage);
            }
        } else {
            // For players, just go back to waiting room
            setGameState(prev => ({
                ...prev,
                gameStarted: false,
                screen: 'waiting'
            }));
        }
    }, [gameState.isHost, gameState.gameId, unsubscribe]);

    const leaveGame = useCallback(async () => {
        if (unsubscribe) {
            unsubscribe();
        }
        
        if (gameState.gameId && !gameState.isHost) {
            try {
                await gameStorage.removePlayer(gameState.gameId, gameState.playerName);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                debugLogger.error('Error leaving game: ' + errorMessage);
            }
        }
        
        window.location.href = window.location.pathname;
    }, [gameState.gameId, gameState.isHost, gameState.playerName, unsubscribe]);

    const value = {
        gameState,
        notification,
        showNotification,
        setupHost,
        joinGame,
        startGame,
        startNewRound,
        endGame,
        leaveGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};