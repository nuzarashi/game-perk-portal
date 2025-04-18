
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Bookmark, 
  ExternalLink, 
  Heart, 
  ShoppingCart, 
  Tag, 
  ThumbsUp 
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Game {
  id: string;
  title: string;
  imageUrl: string;
  platform: 'steam' | 'epic' | 'gog' | 'amazon';
  status?: 'sale' | 'free' | null;
  discount?: string;
  originalPrice?: string;
  salePrice?: string;
  inBacklog: boolean;
}

interface GameCardProps {
  game: Game;
  onAddToBacklog: (gameId: string) => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onAddToBacklog }) => {
  return (
    <div className="game-card bg-gaming-card">
      <div className="relative h-40 overflow-hidden rounded-t-lg">
        <img 
          src={game.imageUrl || "https://placehold.co/400x200/262B38/FFFFFF?text=Game+Cover"} 
          alt={game.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        
        <div className="absolute top-2 left-2">
          <div className={cn("platform-badge", game.platform)}>
            {game.platform.charAt(0).toUpperCase() + game.platform.slice(1)}
          </div>
        </div>
        
        {game.status && (
          <div className="absolute top-2 right-2">
            <div className={cn("status-badge", game.status)}>
              {game.status === 'sale' ? (
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  <span>{game.discount}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-3 w-3" />
                  <span>FREE</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="font-semibold text-white truncate">{game.title}</h3>
        
        {game.status === 'sale' && game.originalPrice && game.salePrice && (
          <div className="mt-1 flex items-center gap-2">
            <span className="text-gaming-muted-foreground line-through text-xs">{game.originalPrice}</span>
            <span className="text-gaming-sale font-medium">{game.salePrice}</span>
          </div>
        )}
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant={game.inBacklog ? "default" : "ghost"} 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onAddToBacklog(game.id)}
            >
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
          
          {game.status && (
            <Button size="sm" className="h-8 gap-1" variant={game.status === 'free' ? "default" : "secondary"}>
              {game.status === 'free' ? 'Claim' : 'Buy'} 
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameCard;
