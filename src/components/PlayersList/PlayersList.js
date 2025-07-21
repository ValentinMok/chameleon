import React from 'react';
import './PlayersList.css';

function PlayersList({ players, currentPlayer }) {
    return (
        <div className="players-list">
            {players.map((player, index) => {
                const isCurrentPlayer = currentPlayer === player.name;
                const displayName = player.name + (isCurrentPlayer ? ' (You)' : '') + (player.isHost ? ' - Host' : '');
                
                return (
                    <div key={index} className="player-item">
                        <span className="player-name">{displayName}</span>
                        <span className={`player-status ${player.isHost ? 'status-host' : 'status-player'}`}>
                            {player.isHost ? 'HOST' : 'PLAYER'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

export default PlayersList;