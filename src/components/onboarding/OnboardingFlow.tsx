
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Steam, AlertCircle } from 'lucide-react';
import { PlatformInfo, PLATFORMS } from '@/types/platform';
import PlatformChecklist from './PlatformChecklist';
import ValueProposition from './ValueProposition';
import { useAuth } from '@/providers/AuthProvider';

const OnboardingFlow = () => {
  const [step, setStep] = useState<'demo' | 'steam' | 'platforms' | 'value'>('demo');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<string>>(new Set(['steam']));
  const { signInWithSteam } = useAuth();

  const handleSteamConnect = async () => {
    try {
      await signInWithSteam();
      setStep('platforms');
    } catch (error) {
      console.error('Error connecting Steam:', error);
    }
  };

  const handlePlatformSelect = (platformId: string) => {
    setSelectedPlatforms(prev => {
      const newSet = new Set(prev);
      if (newSet.has(platformId)) {
        newSet.delete(platformId);
      } else {
        newSet.add(platformId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-gaming-background text-gaming-foreground">
      <main className="container mx-auto px-4 py-8">
        {step === 'demo' && (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h1 className="text-4xl font-bold">Track Your Games Across Platforms</h1>
            <p className="text-xl text-gaming-muted-foreground">
              Never miss a sale or free game from your wishlist again
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button 
                size="lg"
                className="gap-2"
                onClick={() => setStep('steam')}
              >
                <Steam className="h-5 w-5" />
                Try With Steam Library
              </Button>
              <p className="text-sm text-gaming-muted-foreground">
                No sign up required - see it in action first
              </p>
            </div>
          </div>
        )}

        {step === 'steam' && (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold">Connect Your Steam Account</h2>
            <div className="p-4 border border-gaming-steam/30 rounded-lg bg-gaming-steam/10">
              <p className="text-gaming-muted-foreground mb-4">
                We'll check your Steam library and wishlist for:
              </p>
              <ul className="space-y-2 text-left">
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gaming-steam" />
                  Games currently on sale
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gaming-steam" />
                  Free game giveaways
                </li>
                <li className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-gaming-steam" />
                  Unplayed games in your library
                </li>
              </ul>
            </div>
            <Button 
              size="lg" 
              className="gap-2"
              onClick={handleSteamConnect}
            >
              <Steam className="h-5 w-5" />
              Connect Steam
            </Button>
          </div>
        )}

        {step === 'platforms' && (
          <PlatformChecklist
            platforms={PLATFORMS}
            selectedPlatforms={selectedPlatforms}
            onPlatformSelect={handlePlatformSelect}
            onComplete={() => setStep('value')}
          />
        )}

        {step === 'value' && (
          <ValueProposition
            platforms={Array.from(selectedPlatforms)}
            onSignUpClick={() => {/* Navigate to sign up */}}
          />
        )}
      </main>
    </div>
  );
};

export default OnboardingFlow;
