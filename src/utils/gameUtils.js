export function generateGameId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameId = '';
    for (let i = 0; i < 6; i++) {
        gameId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gameId;
}

export function getGameIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('game');
}

export function createGameUrl(gameId) {
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    return baseUrl + '?game=' + gameId;
}

export function selectRandomChameleon(playerCount) {
    return Math.floor(Math.random() * playerCount);
}

export function selectRandomTopicAndWord(topics) {
    const topicNames = Object.keys(topics);
    const randomTopic = topicNames[Math.floor(Math.random() * topicNames.length)];
    const words = topics[randomTopic];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    return {
        topic: randomTopic,
        word: randomWord
    };
}