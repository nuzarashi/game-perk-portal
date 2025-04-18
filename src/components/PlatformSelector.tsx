
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gamepad2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Platform {
  id: string;
  name: string;
  color: string;
  connected: boolean;
}

const platforms: Platform[] = [
  { id: 'steam', name: 'Steam', color: 'bg-gaming-steam', connected: true },
  { id: 'epic', name: 'Epic Games', color: 'bg-gaming-epic', connected: false },
  { id: 'gog', name: 'GOG', color: 'bg-gaming-gog', connected: true },
  { id: 'amazon', name: 'Amazon Games', color: 'bg-gaming-amazon', connected: false },
];

interface PlatformSelectorProps {
  onPlatformSelect: (platformId: string) => void;
  selectedPlatform: string;
}

const PlatformSelector: React.FC<PlatformSelectorProps> = ({ 
  onPlatformSelect,
  selectedPlatform
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => (
        <Button 
          key={platform.id}
          variant="ghost" 
          className={cn(
            "flex items-center gap-2 rounded-full px-4 border border-gaming-muted/30",
            selectedPlatform === platform.id && "bg-gaming-muted/30"
          )}
          onClick={() => onPlatformSelect(platform.id)}
        >
          <div className={cn("w-2 h-2 rounded-full", platform.color)}></div>
          {platform.name}
          {!platform.connected && (
            <span className="text-xs text-gaming-muted-foreground">(Connect)</span>
          )}
        </Button>
      ))}
      <Button variant="outline" size="icon" className="rounded-full">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default PlatformSelector;
