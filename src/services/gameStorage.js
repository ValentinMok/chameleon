import { ref, set, get, update, onValue, off, runTransaction, serverTimestamp } from 'firebase/database';
import { database } from '../config/firebase';
import debugLogger from './debugLogger';

class GameStorage {
    async createGame(gameId, hostName) {
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
            debugLogger.error(`Error creating game: ${error.message}`);
            throw error;
        }
    }
    
    async addPlayer(gameId, playerName) {
        debugLogger.log(`Adding player ${playerName} to game ${gameId}`);
        
        try {
            // First check if game exists
            const gameRef = ref(database, `games/${gameId}`);
            const snapshot = await get(gameRef);
            
            if (!snapshot.exists()) {
                debugLogger.error(`Game ${gameId} not found`);
                throw new Error('Game not found');
            }
            
            const game = snapshot.val();
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
            await runTransaction(playersRef, (players) => {
                if (!players) players = [];
                players.push({name: playerName, isHost: false});
                return players;
            });
            
            debugLogger.success(`Player ${playerName} added successfully`);
            return true;
        } catch (error) {
            debugLogger.error(`Error adding player: ${error.message}`);
            throw error;
        }
    }
    
    async getGame(gameId) {
        debugLogger.log(`Getting game ${gameId}`);
        
        try {
            const snapshot = await get(ref(database, `games/${gameId}`));
            const game = snapshot.val();
            debugLogger.log(`Game ${gameId} data: ${game ? 'found' : 'not found'}`);
            return game;
        } catch (error) {
            debugLogger.error(`Error getting game: ${error.message}`);
            throw error;
        }
    }
    
    async updateGame(gameId, updates) {
        debugLogger.log(`Updating game ${gameId}:`, JSON.stringify(updates));
        
        try {
            await update(ref(database, `games/${gameId}`), updates);
            debugLogger.success(`Game ${gameId} updated successfully`);
        } catch (error) {
            debugLogger.error(`Error updating game: ${error.message}`);
            throw error;
        }
    }
    
    async removePlayer(gameId, playerName) {
        debugLogger.log(`Removing player ${playerName} from game ${gameId}`);
        
        try {
            const playersRef = ref(database, `games/${gameId}/players`);
            await runTransaction(playersRef, (players) => {
                if (!players) return [];
                return players.filter(p => p.name !== playerName);
            });
            
            debugLogger.success(`Player ${playerName} removed successfully`);
        } catch (error) {
            debugLogger.error(`Error removing player: ${error.message}`);
            throw error;
        }
    }
    
    listenToGame(gameId, callback) {
        debugLogger.log(`Starting to listen to game ${gameId}`);
        
        const gameRef = ref(database, `games/${gameId}`);
        const unsubscribe = onValue(gameRef, (snapshot) => {
            const game = snapshot.val();
            if (game) {
                debugLogger.log(`Game ${gameId} update received`);
                callback(game);
            } else {
                debugLogger.error(`Game ${gameId} no longer exists`);
                callback(null);
            }
        }, (error) => {
            debugLogger.error(`Error listening to game: ${error.message}`);
        });
        
        return unsubscribe;
    }
    
    stopListening(gameId) {
        debugLogger.log(`Stopping listener for game ${gameId}`);
        off(ref(database, `games/${gameId}`));
    }
}

const gameStorage = new GameStorage();
export default gameStorage;