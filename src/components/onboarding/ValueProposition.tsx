
import React from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from 'lucide-react';

interface ValuePropositionProps {
  platforms: string[];
  onSignUpClick: () => void;
}

const ValueProposition = ({ platforms, onSignUpClick }: ValuePropositionProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      <h2 className="text-2xl font-bold">
        Ready to Never Miss a Game Deal Again?
      </h2>

      <div className="space-y-4">
        <div className="p-6 rounded-lg border border-gaming-primary/30 bg-gaming-primary/10">
          <p className="text-xl mb-4">Here's what we found in your Steam library:</p>
          <div className="space-y-2">
            <p className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gaming-primary" />
              <span>183 games in your library</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gaming-primary" />
              <span>38 games on your wishlist</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-gaming-primary" />
              <span>12 games currently on sale</span>
            </p>
          </div>
        </div>

        {platforms.length > 1 && (
          <div className="p-6 rounded-lg border border-gaming-muted/30">
            <p className="text-gaming-muted-foreground mb-4">
              We'll also keep track of deals from:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {platforms
                .filter(p => p !== 'steam')
                .map(platform => (
                  <span
                    key={platform}
                    className="px-3 py-1 rounded-full bg-gaming-muted/10 text-sm"
                  >
                    {platform}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Button size="lg" onClick={onSignUpClick}>
          Create Free Account
        </Button>
        <p className="text-sm text-gaming-muted-foreground">
          To save your settings and get daily deal alerts
        </p>
      </div>
    </div>
  );
};

export default ValueProposition;
