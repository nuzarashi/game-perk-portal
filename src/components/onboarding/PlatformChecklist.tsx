
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PlatformInfo } from '@/types/platform';
import { ArrowRight } from 'lucide-react';

interface PlatformChecklistProps {
  platforms: PlatformInfo[];
  selectedPlatforms: Set<string>;
  onPlatformSelect: (platformId: string) => void;
  onComplete: () => void;
}

const PlatformChecklist = ({
  platforms,
  selectedPlatforms,
  onPlatformSelect,
  onComplete
}: PlatformChecklistProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Where Do You Get Your Games?</h2>
        <p className="text-gaming-muted-foreground">
          Select all platforms you use to help us find the best deals for you
        </p>
      </div>

      <div className="space-y-4 mt-8">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              selectedPlatforms.has(platform.id)
                ? 'border-gaming-primary/50 bg-gaming-primary/10'
                : 'border-gaming-muted/30'
            }`}
          >
            <div className="flex items-center gap-4">
              <Checkbox
                id={platform.id}
                checked={selectedPlatforms.has(platform.id)}
                onCheckedChange={() => onPlatformSelect(platform.id)}
                disabled={platform.id === 'steam'}
              />
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${platform.color}`} />
                <label htmlFor={platform.id} className="cursor-pointer">
                  {platform.name}
                </label>
              </div>
            </div>
            {platform.status === 'coming_soon' && (
              <span className="text-xs text-gaming-muted-foreground">
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Button onClick={onComplete} className="gap-2">
          Continue
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PlatformChecklist;
