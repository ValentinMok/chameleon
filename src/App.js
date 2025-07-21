import React, { useEffect } from 'react';
import './App.css';
import { GameProvider, useGame } from './contexts/GameContext';
import HostScreen from './components/HostScreen/HostScreen';
import JoinScreen from './components/JoinScreen/JoinScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';
import GameScreen from './components/GameScreen/GameScreen';
import DebugConsole from './components/DebugConsole/DebugConsole';
import Notification from './components/Notification/Notification';
import { getGameIdFromUrl } from './utils/gameUtils';
import debugLogger from './services/debugLogger';

function AppContent() {
    const { gameState, setupHost } = useGame();

    useEffect(() => {
        debugLogger.log('Initializing game');
        
        // Check if this is a join URL
        const gameId = getGameIdFromUrl();
        
        if (gameId) {
            debugLogger.log(`Join URL detected with game ID: ${gameId}`);
            // Game ID in URL means this is a player joining
            // The join screen will be shown by default
        } else {
            debugLogger.log('No game ID in URL - setting up as host');
            // No game ID means this is the host
            setupHost();
        }
    }, [setupHost]);

    const renderScreen = () => {
        switch (gameState.screen) {
            case 'host':
                return <HostScreen />;
            case 'join':
                return <JoinScreen />;
            case 'waiting':
                return <WaitingScreen />;
            case 'game':
                return <GameScreen />;
            default:
                return <JoinScreen />;
        }
    };

    return (
        <div className="app">
            <div className="container">
                {renderScreen()}
            </div>
            
            <Notification />
            
            {/* Only show debug console for hosts */}
            {gameState.isHost && <DebugConsole />}
        </div>
    );
}

function App() {
    return (
        <GameProvider>
            <AppContent />
        </GameProvider>
    );
}

export default App;