import { ChameleonTopics, TopicAndWord } from '../types';

export function generateGameId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let gameId = '';
    for (let i = 0; i < 6; i++) {
        gameId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return gameId;
}

export function getGameIdFromUrl(): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('game');
}

export function createGameUrl(gameId: string): string {
    const baseUrl = window.location.protocol + '//' + window.location.host + window.location.pathname;
    return baseUrl + '?game=' + gameId;
}

export function selectRandomChameleon(playerCount: number): number {
    return Math.floor(Math.random() * playerCount);
}

export function selectRandomTopicAndWord(topics: ChameleonTopics): TopicAndWord {
    const topicNames = Object.keys(topics);
    const randomTopic = topicNames[Math.floor(Math.random() * topicNames.length)];
    const words = topics[randomTopic];
    const randomWord = words[Math.floor(Math.random() * words.length)];
    
    return {
        topic: randomTopic,
        word: randomWord
    };
}