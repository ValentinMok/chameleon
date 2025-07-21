import { ref, set, get, update, onValue, off, runTransaction, serverTimestamp, DataSnapshot } from 'firebase/database';
import { database } from '../config/firebase';
import debugLogger from './debugLogger';
import { Player, GameData } from '../types';

class GameStorage {
    async createGame(gameId: string, hostName: string): Promise<void> {
        debugLogger.log(`Creating game ${gameId} with host ${hostName}`);
        
        try {
            await set(ref(database, `games/${gameId}`), {
                players: [{name: hostName, isHost: true}],
                started: false,
                chameleonIndex: -1,
                currentWord: '',
                currentTopic: '',
                timestamp: serverTimestamp()
            });
            
            debugLogger.success(`Game ${gameId} created successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLogger.error(`Error creating game: ${errorMessage}`);
            throw error;
        }
    }
    
    async addPlayer(gameId: string, playerName: string): Promise<boolean> {
        debugLogger.log(`Adding player ${playerName} to game ${gameId}`);
        
        try {
            // First check if game exists
            const gameRef = ref(database, `games/${gameId}`);
            const snapshot = await get(gameRef);
            
            if (!snapshot.exists()) {
                debugLogger.error(`Game ${gameId} not found`);
                throw new Error('Game not found');
            }
            
            const game: GameData = snapshot.val();
            if (game.started) {
                debugLogger.error(`Game ${gameId} already started`);
                return false;
            }
            
            // Check if player already exists
            if (game.players && game.players.find(p => p.name === playerName)) {
                debugLogger.error(`Player ${playerName} already in game`);
                return false;
            }
            
            // Add player using transaction to ensure uniqueness
            const playersRef = ref(database, `games/${gameId}/players`);
            await runTransaction(playersRef, (players: Player[] | null) => {
                if (!players) players = [];
                players.push({name: playerName, isHost: false});
                return players;
            });
            
            debugLogger.success(`Player ${playerName} added successfully`);
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLogger.error(`Error adding player: ${errorMessage}`);
            throw error;
        }
    }
    
    async getGame(gameId: string): Promise<GameData | null> {
        debugLogger.log(`Getting game ${gameId}`);
        
        try {
            const snapshot = await get(ref(database, `games/${gameId}`));
            const game: GameData | null = snapshot.val();
            debugLogger.log(`Game ${gameId} data: ${game ? 'found' : 'not found'}`);
            return game;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLogger.error(`Error getting game: ${errorMessage}`);
            throw error;
        }
    }
    
    async updateGame(gameId: string, updates: Partial<GameData>): Promise<void> {
        debugLogger.log(`Updating game ${gameId}: ${JSON.stringify(updates)}`);
        
        try {
            await update(ref(database, `games/${gameId}`), updates);
            debugLogger.success(`Game ${gameId} updated successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLogger.error(`Error updating game: ${errorMessage}`);
            throw error;
        }
    }
    
    async removePlayer(gameId: string, playerName: string): Promise<void> {
        debugLogger.log(`Removing player ${playerName} from game ${gameId}`);
        
        try {
            const playersRef = ref(database, `games/${gameId}/players`);
            await runTransaction(playersRef, (players: Player[] | null) => {
                if (!players) return [];
                return players.filter((p: Player) => p.name !== playerName);
            });
            
            debugLogger.success(`Player ${playerName} removed successfully`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            debugLogger.error(`Error removing player: ${errorMessage}`);
            throw error;
        }
    }
    
    listenToGame(gameId: string, callback: (game: GameData | null) => void): () => void {
        debugLogger.log(`Starting to listen to game ${gameId}`);
        
        const gameRef = ref(database, `games/${gameId}`);
        const unsubscribe = onValue(gameRef, (snapshot: DataSnapshot) => {
            const game: GameData | null = snapshot.val();
            if (game) {
                debugLogger.log(`Game ${gameId} update received`);
                callback(game);
            } else {
                debugLogger.error(`Game ${gameId} no longer exists`);
                callback(null);
            }
        }, (error: Error) => {
            debugLogger.error(`Error listening to game: ${error.message}`);
        });
        
        return unsubscribe;
    }
    
    stopListening(gameId: string): void {
        debugLogger.log(`Stopping listener for game ${gameId}`);
        off(ref(database, `games/${gameId}`));
    }
}

const gameStorage = new GameStorage();
export default gameStorage;