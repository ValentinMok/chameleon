import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Game titles
    'game.title': 'The Chameleon',
    'game.waitingRoom': 'Waiting Room',
    
    // Host screen
    'host.setupMessage': 'Set up the game on your phone, then others can join by scanning the QR code!',
    'host.players': 'Players',
    'host.startGame': 'Start Game',
    'host.startGamePlayers': 'Start Game ({count} players)',
    'host.needMorePlayers': 'Start Game (Need {count} more players)',
    'host.debugConsole': '🐛 Debug Console',
    'host.scanToJoin': 'Scan to Join Game',
    'host.copyLink': '📋 Copy Link',
    'host.copied': '✅ Copied!',
    'host.gameCode': 'Game Code',
    
    // Join screen
    'join.enterName': 'Enter your name',
    'join.namePlaceholder': 'Your name...',
    'join.joinGame': 'Join Game',
    
    // Waiting screen
    'waiting.message': 'Waiting for host to start the game...',
    'waiting.playersInGame': 'Players in Game',
    'waiting.gameCodeLabel': 'Game Code:',
    
    // Game screen
    'game.regularPlayer': 'You are a REGULAR PLAYER 🕵️',
    'game.chameleon': 'You are the CHAMELEON! 🦎',
    'game.topic': 'Topic:',
    'game.topicOnly': 'Topic:',
    'game.startNewRound': 'Start New Round',
    
    // Common
    'common.leaveGame': 'Leave Game',
    'common.yes': 'Yes',
    'common.no': 'No',
    
    // Notifications
    'notification.gameNoLongerExists': 'Game no longer exists',
    'notification.joinedSuccessfully': 'Successfully joined the game!',
    'notification.couldNotJoin': 'Could not join - game may have started or name taken',
    'notification.gameNotFound': 'Game not found. Check the game code.',
    'notification.newRoundStarted': 'New round started!'
  },
  de: {
    // Game titles
    'game.title': 'Das Chamäleon',
    'game.waitingRoom': 'Warteraum',
    
    // Host screen
    'host.setupMessage': 'Richte das Spiel auf deinem Handy ein, dann können andere durch Scannen des QR-Codes beitreten!',
    'host.players': 'Spieler',
    'host.startGame': 'Spiel starten',
    'host.startGamePlayers': 'Spiel starten ({count} Spieler)',
    'host.needMorePlayers': 'Spiel starten ({count} weitere Spieler benötigt)',
    'host.debugConsole': '🐛 Debug-Konsole',
    'host.scanToJoin': 'Scannen zum Beitreten',
    'host.copyLink': '📋 Link kopieren',
    'host.copied': '✅ Kopiert!',
    'host.gameCode': 'Spielcode',
    
    // Join screen
    'join.enterName': 'Gib deinen Namen ein',
    'join.namePlaceholder': 'Dein Name...',
    'join.joinGame': 'Spiel beitreten',
    
    // Waiting screen
    'waiting.message': 'Warten darauf, dass der Host das Spiel startet...',
    'waiting.playersInGame': 'Spieler im Spiel',
    'waiting.gameCodeLabel': 'Spielcode:',
    
    // Game screen
    'game.regularPlayer': 'Du bist ein NORMALER SPIELER 🕵️',
    'game.chameleon': 'Du bist das CHAMÄLEON! 🦎',
    'game.topic': 'Thema:',
    'game.topicOnly': 'Thema:',
    'game.startNewRound': 'Neue Runde starten',
    
    // Common
    'common.leaveGame': 'Spiel verlassen',
    'common.yes': 'Ja',
    'common.no': 'Nein',
    
    // Notifications
    'notification.gameNoLongerExists': 'Spiel existiert nicht mehr',
    'notification.joinedSuccessfully': 'Erfolgreich dem Spiel beigetreten!',
    'notification.couldNotJoin': 'Konnte nicht beitreten - Spiel wurde möglicherweise gestartet oder Name bereits vergeben',
    'notification.gameNotFound': 'Spiel nicht gefunden. Überprüfe den Spielcode.',
    'notification.newRoundStarted': 'Neue Runde gestartet!'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    const languageTranslations = translations[language];
    const translation = (languageTranslations as any)[key];
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    return translation;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};