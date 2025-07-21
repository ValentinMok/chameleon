# 🦎 The Chameleon Game

A digital version of the popular party game "The Chameleon" built with React and Firebase.

## 🎮 How to Play

1. **Host creates a game** - One player starts the game and shares the QR code/link
2. **Players join** - Other players scan the QR code or enter the game code
3. **Game starts** - Everyone sees a topic and word grid, except...
4. **The Chameleon** - One random player is the chameleon who only sees the topic!
5. **Take turns** - Each player says one word related to the secret word
6. **Find the Chameleon** - Vote on who you think is blending in
7. **Chameleon's chance** - If caught, they can still win by guessing the secret word!

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Firebase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/chameleon-game.git
cd chameleon-game
```

2. Install dependencies:
```bash
npm install
```

3. Update Firebase configuration in `src/config/firebase.js` with your own Firebase project credentials.

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🏗️ Project Structure

```
src/
├── components/        # React components
│   ├── HostScreen/   # Game setup screen
│   ├── JoinScreen/   # Player join screen
│   ├── WaitingScreen/# Waiting room
│   ├── GameScreen/   # Main game interface
│   └── ...          # Other reusable components
├── services/         # Business logic
│   ├── gameStorage.js # Firebase operations
│   └── debugLogger.js # Debug logging
├── utils/           # Utility functions
├── data/           # Game data (topics/words)
├── contexts/       # React contexts
└── config/         # Configuration files
```

## 🛠️ Technologies Used

- **React** - Frontend framework
- **Firebase Realtime Database** - Real-time game state synchronization
- **QRious** - QR code generation
- **CSS3** - Styling with modern features

## 📱 Features

- Real-time multiplayer gameplay
- QR code for easy game joining
- Responsive design for mobile and desktop
- Debug console for development
- Animated UI with modern glassmorphism design
- Support for 50+ different topics

## 🚀 Deployment

### GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to package.json:
```json
"homepage": "https://yourusername.github.io/chameleon-game",
"scripts": {
  ...
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

3. Deploy:
```bash
npm run deploy
```

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Initialize Firebase:
```bash
firebase init hosting
```

3. Build and deploy:
```bash
npm run build
firebase deploy
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by the board game "The Chameleon" by Big Potato Games
- Built with React and Firebase