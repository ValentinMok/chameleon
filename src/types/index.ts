export interface Player {
  name: string;
  isHost: boolean;
}

export interface GameState {
  isHost: boolean;
  playerName: string;
  chameleonIndex: number;
  currentWord: string;
  currentTopic: string;
  gameId: string;
  gameStarted: boolean;
  players: Player[];
  screen: 'host' | 'join' | 'waiting' | 'game';
}

export interface GameData {
  players: Player[];
  started: boolean;
  chameleonIndex: number;
  currentWord: string;
  currentTopic: string;
  timestamp?: any;
}

export interface Notification {
  message: string;
  type: 'info' | 'success' | 'error';
}

export interface GameContextType {
  gameState: GameState;
  notification: Notification | null;
  showNotification: (message: string, type?: 'info' | 'success' | 'error') => void;
  setupHost: () => Promise<void>;
  joinGame: (gameId: string, playerName: string) => Promise<boolean>;
  startGame: () => Promise<void>;
  startNewRound: () => Promise<void>;
  endGame: () => Promise<void>;
  leaveGame: () => Promise<void>;
}

export interface TopicAndWord {
  topic: string;
  word: string;
}

export interface ChameleonTopics {
  [key: string]: string[];
}

export interface DebugLog {
  message: string;
  type: 'info' | 'error' | 'success';
  timestamp: string;
}