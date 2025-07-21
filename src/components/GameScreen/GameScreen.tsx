import React from 'react';
import './GameScreen.css';
import { useGame } from '../../contexts/GameContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { translatedTopics } from '../../data/translatedTopics';

const GameScreen: React.FC = () => {
    const { gameState, startNewRound } = useGame();
    const { t, getTopics } = useLanguage();
    const { 
        isHost, 
        playerName, 
        players, 
        chameleonIndex, 
        currentWord, 
        currentTopic 
    } = gameState;

    // Determine if current player is the chameleon
    const playerIndex = players.findIndex(p => p.name === playerName);
    const isPlayerChameleon = playerIndex === chameleonIndex;
    
    // Get the current language's translated topics - this already returns the correct language
    const currentLanguageTopics = getTopics();
    
    // Add safety check
    if (!currentLanguageTopics || !currentTopic) {
        return (
            <>
                <h1>🦎 {t('game.title')}</h1>
                <p>Loading game...</p>
            </>
        );
    }
    
    // Map English topic name (stored in game state) to translated display name
    const topicMapping = {
        "Animals": t('game.title') === 'Chamäleon' ? "Tiere" : "Animals",
        "Food": t('game.title') === 'Chamäleon' ? "Essen" : "Food",
        "Movies": t('game.title') === 'Chamäleon' ? "Filme" : "Movies",
        "Sports": t('game.title') === 'Chamäleon' ? "Sport" : "Sports",
        "Colors": t('game.title') === 'Chamäleon' ? "Farben" : "Colors",
        "Travel": t('game.title') === 'Chamäleon' ? "Reisen" : "Travel",
        "Technology": t('game.title') === 'Chamäleon' ? "Technologie" : "Technology",
        "Music": t('game.title') === 'Chamäleon' ? "Musik" : "Music",
        "Jobs": t('game.title') === 'Chamäleon' ? "Berufe" : "Jobs",
        "Transportation": t('game.title') === 'Chamäleon' ? "Verkehrsmittel" : "Transportation",
        "Weather": t('game.title') === 'Chamäleon' ? "Wetter" : "Weather",
        "Body Parts": t('game.title') === 'Chamäleon' ? "Körperteile" : "Body Parts",
        "School": t('game.title') === 'Chamäleon' ? "Schule" : "School",
        "Clothing": t('game.title') === 'Chamäleon' ? "Kleidung" : "Clothing",
        "Furniture": t('game.title') === 'Chamäleon' ? "Möbel" : "Furniture",
        "Emotions": t('game.title') === 'Chamäleon' ? "Gefühle" : "Emotions",
        "Hobbies": t('game.title') === 'Chamäleon' ? "Hobbys" : "Hobbies",
        "Countries": t('game.title') === 'Chamäleon' ? "Länder" : "Countries",
        "Space": t('game.title') === 'Chamäleon' ? "Weltall" : "Space",
        "Kitchen": t('game.title') === 'Chamäleon' ? "Küche" : "Kitchen",
        "Nature": t('game.title') === 'Chamäleon' ? "Natur" : "Nature",
        "Games": t('game.title') === 'Chamäleon' ? "Spiele" : "Games",
        "Instruments": t('game.title') === 'Chamäleon' ? "Instrumente" : "Instruments",
        "Fruits": t('game.title') === 'Chamäleon' ? "Früchte" : "Fruits",
        "Vegetables": t('game.title') === 'Chamäleon' ? "Gemüse" : "Vegetables",
        "Desserts": t('game.title') === 'Chamäleon' ? "Nachspeisen" : "Desserts",
        "Drinks": t('game.title') === 'Chamäleon' ? "Getränke" : "Drinks",
        "Seasons": t('game.title') === 'Chamäleon' ? "Jahreszeiten" : "Seasons",
        "Holidays": t('game.title') === 'Chamäleon' ? "Feiertage" : "Holidays",
        "Tools": t('game.title') === 'Chamäleon' ? "Werkzeuge" : "Tools",
        "Toys": t('game.title') === 'Chamäleon' ? "Spielzeug" : "Toys",
        "Family": t('game.title') === 'Chamäleon' ? "Familie" : "Family",
        "Bathroom": t('game.title') === 'Chamäleon' ? "Badezimmer" : "Bathroom",
        "Office": t('game.title') === 'Chamäleon' ? "Büro" : "Office",
        "Garden": t('game.title') === 'Chamäleon' ? "Garten" : "Garden",
        "Hospital": t('game.title') === 'Chamäleon' ? "Krankenhaus" : "Hospital",
        "Beach": t('game.title') === 'Chamäleon' ? "Strand" : "Beach",
        "Farm": t('game.title') === 'Chamäleon' ? "Bauernhof" : "Farm",
        "Circus": t('game.title') === 'Chamäleon' ? "Zirkus" : "Circus",
        "Mountain": t('game.title') === 'Chamäleon' ? "Berg" : "Mountain",
        "Library": t('game.title') === 'Chamäleon' ? "Bibliothek" : "Library",
        "Zoo": t('game.title') === 'Chamäleon' ? "Zoo" : "Zoo",
        "Airport": t('game.title') === 'Chamäleon' ? "Flughafen" : "Airport",
        "Restaurant": t('game.title') === 'Chamäleon' ? "Restaurant" : "Restaurant",
        "Park": t('game.title') === 'Chamäleon' ? "Park" : "Park",
        "Supermarket": t('game.title') === 'Chamäleon' ? "Supermarkt" : "Supermarket",
        "Camping": t('game.title') === 'Chamäleon' ? "Camping" : "Camping",
        "Wedding": t('game.title') === 'Chamäleon' ? "Hochzeit" : "Wedding",
        "Birthday": t('game.title') === 'Chamäleon' ? "Geburtstag" : "Birthday",
        "Ocean": t('game.title') === 'Chamäleon' ? "Ozean" : "Ocean",
        "Desert": t('game.title') === 'Chamäleon' ? "Wüste" : "Desert",
        "Winter": t('game.title') === 'Chamäleon' ? "Winter" : "Winter",
        "Pirates": t('game.title') === 'Chamäleon' ? "Piraten" : "Pirates",
        "Magic": t('game.title') === 'Chamäleon' ? "Magie" : "Magic",
        "Knights": t('game.title') === 'Chamäleon' ? "Ritter" : "Knights",
        "Jungle": t('game.title') === 'Chamäleon' ? "Dschungel" : "Jungle",
        "Space Station": t('game.title') === 'Chamäleon' ? "Raumstation" : "Space Station",
        "Bakery": t('game.title') === 'Chamäleon' ? "Bäckerei" : "Bakery",
        "Fire Station": t('game.title') === 'Chamäleon' ? "Feuerwehr" : "Fire Station",
        "School Bus": t('game.title') === 'Chamäleon' ? "Schulbus" : "School Bus"
    };
    
    const translatedTopicName = (topicMapping as any)[currentTopic] || currentTopic;
    const wordsArray = (currentLanguageTopics as any)[translatedTopicName] || [];
    
    // Find the translated version of the current secret word
    const englishWords = (translatedTopics.en as any)[currentTopic] || [];
    const wordIndex = englishWords.indexOf(currentWord);
    const translatedSecretWord = wordIndex >= 0 ? wordsArray[wordIndex] : currentWord;

    return (
        <>
            <h1>🦎 {t('game.title')}</h1>
            
            <div className="game-info">
                <div className={`role-display ${isPlayerChameleon ? 'chameleon' : 'regular'}`}>
                    {isPlayerChameleon 
                        ? t('game.chameleon')
                        : t('game.regularPlayer')}
                </div>
                
                {!isPlayerChameleon ? (
                    <div id="wordSection">
                        <div className="topic-header">{t('game.topic')} <span>{translatedTopicName}</span></div>
                        <div className="word-grid">
                            {wordsArray?.map((word: string, index: number) => (
                                <div 
                                    key={index} 
                                    className={`word-item ${word === translatedSecretWord ? 'secret' : ''}`}
                                >
                                    {word}
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div id="topicSection">
                        <div className="chameleon-topic-only">
                            <div className="topic-label">{t('game.topicOnly')}</div>
                            <div className="topic-value">{translatedTopicName}</div>
                        </div>
                    </div>
                )}
            </div>
            
            {isHost && (
                <button onClick={startNewRound} className="host-only">
                    {t('game.startNewRound')}
                </button>
            )}
        </>
    );
}

export default GameScreen;