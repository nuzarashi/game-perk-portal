
import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Award, Clock, Play, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BacklogGame {
  id: string;
  title: string;
  imageUrl: string;
  platform: 'steam' | 'epic' | 'gog' | 'amazon';
  hoursPlayed: number;
  lastPlayed?: Date;
  priority: 'low' | 'medium' | 'high';
  progress: number;
}

interface BacklogItemProps {
  game: BacklogGame;
}

const BacklogItem: React.FC<BacklogItemProps> = ({ game }) => {
  const priorityColors = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-red-400'
  };

  const formatLastPlayed = (date?: Date) => {
    if (!date) return 'Never played';
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <div className="flex gap-3 p-3 rounded-lg border border-gaming-muted/30 bg-gaming-card hover:bg-gaming-muted/10 transition-colors">
      <div className="flex-shrink-0 h-16 w-16 rounded overflow-hidden">
        <img 
          src={game.imageUrl || "https://placehold.co/100x100/262B38/FFFFFF?text=Game"} 
          alt={game.title}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-medium text-white line-clamp-1">{game.title}</h3>
          <div className="flex items-center gap-1">
            <div className={cn("platform-badge", game.platform)}>
              {game.platform.charAt(0).toUpperCase() + game.platform.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gaming-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{game.hoursPlayed} hours played</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="h-3 w-3" />
            <span>{formatLastPlayed(game.lastPlayed)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Award className={cn("h-3 w-3", priorityColors[game.priority])} />
            <span className={priorityColors[game.priority]}>
              {game.priority.charAt(0).toUpperCase() + game.priority.slice(1)} priority
            </span>
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <Progress value={game.progress} className="h-2 flex-grow" />
          <span className="text-xs whitespace-nowrap">{game.progress}%</span>
        </div>
      </div>
      
      <div className="flex-shrink-0 flex flex-col justify-center">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ThumbsUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default BacklogItem;
