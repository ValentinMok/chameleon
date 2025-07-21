import React, { useEffect, useRef } from 'react';
import QRious from 'qrious';
import './QRCode.css';
import { createGameUrl } from '../../utils/gameUtils';
import { useLanguage } from '../../contexts/LanguageContext';

interface QRCodeProps {
    gameId: string;
}

const QRCode: React.FC<QRCodeProps> = ({ gameId }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useLanguage();
    const gameUrl = createGameUrl(gameId);

    useEffect(() => {
        if (canvasRef.current && gameUrl) {
            new QRious({
                element: canvasRef.current,
                value: gameUrl,
                size: 200,
                background: 'white',
                foreground: 'black'
            });
        }
    }, [gameUrl]);

    const copyLink = () => {
        navigator.clipboard.writeText(gameUrl).then(() => {
            // Could trigger a notification here
            const button = document.querySelector('.copy-button') as HTMLElement;
            if (button) {
                button.textContent = t('host.copied');
                setTimeout(() => {
                    button.textContent = t('host.copyLink');
                }, 2000);
            }
        }).catch(() => {
            // Fallback for older browsers
            const input = document.createElement('input');
            input.value = gameUrl;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        });
    };

    return (
        <div className="qr-container">
            <h3>{t('host.scanToJoin')}</h3>
            <div className="qrcode">
                <canvas ref={canvasRef}></canvas>
            </div>
            <div className="url-display">{gameUrl}</div>
            
            <button onClick={copyLink} className="copy-button">
                {t('host.copyLink')}
            </button>
            
            {gameId && (
                <div className="game-code-container">
                    <div className="game-code-label">{t('host.gameCode')}</div>
                    <div className="game-code">{gameId}</div>
                </div>
            )}
        </div>
    );
}

export default QRCode;