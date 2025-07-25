import React, { useEffect } from 'react';
import './App.css';
import { GameProvider, useGame } from './contexts/GameContext';
import { LanguageProvider } from './contexts/LanguageContext';
import HostScreen from './components/HostScreen/HostScreen';
import JoinScreen from './components/JoinScreen/JoinScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';
import GameScreen from './components/GameScreen/GameScreen';
import DebugConsole from './components/DebugConsole/DebugConsole';
import Notification from './components/Notification/Notification';
import TopBar from './components/TopBar/TopBar';
import { getGameIdFromUrl } from './utils/gameUtils';
import debugLogger from './services/debugLogger';

const AppContent: React.FC = () => {
    const { gameState, setupHost } = useGame();

    useEffect(() => {
        debugLogger.log('Initializing game');
        
        // Check if this is a join URL
        const gameId = getGameIdFromUrl();
        
        if (gameId) {
            debugLogger.log(`Join URL detected with game ID: ${gameId}`);
            // Game ID in URL means this is a player joining - screen should be 'join'
            // This is handled by the initial state being 'join' by default when not host
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
            <TopBar />
            <div className="container">
                {renderScreen()}
            </div>
            
            <Notification />
            
            {/* Only show debug console for hosts */}
            {gameState.isHost && <DebugConsole />}
        </div>
    );
}

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <GameProvider>
                <AppContent />
            </GameProvider>
        </LanguageProvider>
    );
}

export default App;