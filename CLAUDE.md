# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Start the development server on http://localhost:3000
- `npm run build` - Build the app for production to the build folder
- `npm test` - Run the test suite
- `npm run deploy` - Deploy to GitHub Pages (requires gh-pages setup)

## Architecture Overview

This is a React-based multiplayer party game implementation of "The Chameleon" using Firebase Realtime Database for real-time synchronization.

### Core Architecture Pattern

The application follows a screen-based navigation pattern with centralized state management:

- **GameContext** (`src/contexts/GameContext.js`) - Central state management using React Context, handles all game logic, player management, and Firebase integration
- **Screen Components** - Four main screens that render based on `gameState.screen`:
  - `HostScreen` - Game creation and lobby management
  - `JoinScreen` - Player joining interface
  - `WaitingScreen` - Pre-game player list
  - `GameScreen` - Main game interface

### Key Data Flow

1. **Game Creation**: Host generates a 6-character game ID, creates Firebase record, starts listening for player updates
2. **Player Joining**: Players use game ID to join via URL parameters (`?game=ABCD12`) or manual entry
3. **Real-time Updates**: All clients listen to Firebase changes via `gameStorage.listenToGame()`, updating local state automatically
4. **Game State Sync**: Critical game data (players, chameleon selection, current word/topic) synchronized through Firebase

### Firebase Integration

- **Database Structure**: Games stored under `games/{gameId}` with players array, game state, and current round data
- **Real-time Listeners**: Each client maintains a listener to the game document for instant updates
- **Transactions**: Player operations use Firebase transactions to prevent race conditions
- **Security Model**: No authentication - games are public but require game ID to join

### Game Logic Components

- **gameUtils.js**: Pure functions for game ID generation, URL parsing, random selection
- **chameleonTopics.js**: Static data containing 29+ topic categories with 16 words each
- **debugLogger.js**: Development logging system with browser console integration

### Component Architecture

Components are organized by feature with co-located CSS files. Each major screen is self-contained with its own styling and logic, communicating only through the GameContext.

## Firebase Configuration

Update `src/config/firebase.js` with your Firebase project credentials. The current configuration points to a specific Firebase Realtime Database instance in Europe West.

## Development Notes

- The app detects host vs. player mode by checking for `?game=` URL parameter on load
- Debug console is only shown for hosts and provides real-time logging during development
- QR codes are generated client-side using the QRious library for easy game sharing
- Game IDs are 6-character alphanumeric strings generated client-side

## Testing Multiplayer Locally

Open multiple browser windows/tabs - one without game parameter (becomes host), others with `?game=GAMEID` parameter (become players).