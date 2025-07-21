import React from 'react';
import './TopBar.css';
import { useLanguage, Language } from '../../contexts/LanguageContext';
import { useGame } from '../../contexts/GameContext';

const TopBar: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { gameState, leaveGame } = useGame();

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  const shouldShowLeaveButton = gameState.screen === 'waiting' || gameState.screen === 'game';

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        {shouldShowLeaveButton && (
          <button className="leave-button-top" onClick={leaveGame}>
            {t('common.leaveGame')}
          </button>
        )}
      </div>
      
      <div className="top-bar-right">
        <div className="language-switcher">
          <button
            className={`flag-button ${language === 'en' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('en')}
            title="English"
          >
            🇺🇸
          </button>
          <button
            className={`flag-button ${language === 'de' ? 'active' : ''}`}
            onClick={() => handleLanguageChange('de')}
            title="Deutsch"
          >
            🇩🇪
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopBar;