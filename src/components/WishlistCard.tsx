
import React from 'react';
import GameCard, { Game } from './GameCard';

interface WishlistCardProps {
  title: string;
  games: Game[];
  onAddToBacklog: (gameId: string) => void;
}

const WishlistCard: React.FC<WishlistCardProps> = ({ title, games, onAddToBacklog }) => {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <span className="text-sm text-gaming-muted-foreground">
          {games.length} {games.length === 1 ? 'game' : 'games'}
        </span>
      </div>
      
      {games.length === 0 ? (
        <div className="text-center py-8 text-gaming-muted-foreground">
          <p>No games in this wishlist yet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map(game => (
            <GameCard key={game.id} game={game} onAddToBacklog={onAddToBacklog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistCard;
