
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import PlatformSelector from '@/components/PlatformSelector';
import WishlistCard from '@/components/WishlistCard';
import BacklogItem, { BacklogGame } from '@/components/BacklogItem';
import { Game } from '@/components/GameCard';
import NotificationCenter from '@/components/NotificationCenter';
import AddGameModal from '@/components/AddGameModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Bookmark, 
  Star, 
  Tag, 
  Gamepad2, 
  Gift, 
  LayoutDashboard, 
  Library, 
  ListPlus 
} from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { 
  getWishlistedGames, 
  getBacklogGames, 
  getNotifications,
  addToBacklog, 
  removeFromBacklog,
  markNotificationAsRead,
  addGame
} from '@/services/gameService';

const Index = () => {
  const { user } = useAuth();
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const queryClient = useQueryClient();

  // Fetch wishlist games
  const { 
    data: wishlistGames = [], 
    isLoading: isLoadingWishlist 
  } = useQuery({
    queryKey: ['wishlistGames'],
    queryFn: getWishlistedGames,
  });

  // Fetch backlog games
  const { 
    data: backlogGames = [], 
    isLoading: isLoadingBacklog 
  } = useQuery({
    queryKey: ['backlogGames'],
    queryFn: getBacklogGames,
  });

  // Fetch notifications
  const { 
    data: notifications = [], 
    isLoading: isLoadingNotifications 
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });
  
  // Filter games by platform if a specific one is selected
  const filteredWishlistGames = selectedPlatform === 'all' 
    ? wishlistGames
    : wishlistGames.filter(game => game.platform === selectedPlatform);
  
  // Games on sale
  const onSaleGames = wishlistGames.filter(game => game.status === 'sale');
  
  // Free games
  const freeGames = wishlistGames.filter(game => game.status === 'free');
  
  // Handle adding game to backlog
  const handleAddToBacklog = async (gameId: string) => {
    try {
      const gameToUpdate = wishlistGames.find(game => game.id === gameId);
      if (!gameToUpdate) return;

      if (gameToUpdate.inBacklog) {
        await removeFromBacklog(gameId);
        toast({
          title: "Removed from backlog",
          description: `${gameToUpdate.title} has been removed from your backlog`,
        });
      } else {
        await addToBacklog(gameId);
        toast({
          title: "Added to backlog",
          description: `${gameToUpdate.title} has been added to your backlog`,
        });
      }
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ['wishlistGames'] });
      queryClient.invalidateQueries({ queryKey: ['backlogGames'] });
    } catch (error) {
      console.error('Error toggling backlog status:', error);
      toast({
        title: "Error",
        description: "There was an error updating your backlog",
        variant: "destructive",
      });
    }
  };
  
  // Handle marking notification as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      // Refresh notifications
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "There was an error updating the notification",
        variant: "destructive",
      });
    }
  };
  
  // Handle adding a new game
  const handleAddGame = async (gameData: any) => {
    try {
      // First add the game to the database
      const gameId = await addGame({
        title: gameData.title,
        platform: gameData.platform,
        imageUrl: gameData.imageUrl || '',
        originalPrice: gameData.price ? parseFloat(gameData.price) : undefined,
        isOnSale: gameData.status === 'sale',
        isFree: gameData.status === 'free',
        discountPercentage: gameData.status === 'sale' ? 20 : undefined, // Default discount
        salePrice: gameData.status === 'sale' && gameData.price ? parseFloat(gameData.price) * 0.8 : undefined, // 20% off
      });

      // Then add it to the user's wishlist
      if (gameId) {
        await addToBacklog(gameId);
        
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ['wishlistGames'] });
        queryClient.invalidateQueries({ queryKey: ['backlogGames'] });
        
        toast({
          title: "Game added",
          description: `${gameData.title} has been added to your collection`,
        });
      }
    } catch (error) {
      console.error('Error adding game:', error);
      toast({
        title: "Error",
        description: "There was an error adding the game",
        variant: "destructive",
      });
    }
  };

  if (isLoadingWishlist || isLoadingBacklog || isLoadingNotifications) {
    return (
      <div className="min-h-screen bg-gaming-background text-gaming-foreground">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <p className="text-xl">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-background text-gaming-foreground">
      <Navbar />
      
      <main className="container py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard Header */}
          <div className="md:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                  <LayoutDashboard className="h-7 w-7 text-gaming-primary" />
                  Game Dashboard
                </h1>
                <p className="text-gaming-muted-foreground mt-1">
                  Hello, {user?.email} - Track your games, sales, and backlog across platforms
                </p>
              </div>
              
              <AddGameModal onAddGame={handleAddGame} />
            </div>
          </div>
          
          {/* Notification Section */}
          <div className="md:col-span-1">
            {/* Will be filled with notification center */}
          </div>
          
          {/* Platform Selection + Main Content */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <PlatformSelector 
                onPlatformSelect={setSelectedPlatform}
                selectedPlatform={selectedPlatform}
              />
            </div>
            
            <Tabs defaultValue="wishlist" className="space-y-6">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="wishlist" className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span className="hidden sm:inline">Wishlist</span>
                </TabsTrigger>
                <TabsTrigger value="sales" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span className="hidden sm:inline">Sales</span>
                </TabsTrigger>
                <TabsTrigger value="free" className="flex items-center gap-2">
                  <Gift className="h-4 w-4" />
                  <span className="hidden sm:inline">Free</span>
                </TabsTrigger>
                <TabsTrigger value="backlog" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span className="hidden sm:inline">Backlog</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="wishlist" className="space-y-6">
                <WishlistCard 
                  title="My Wishlist" 
                  games={filteredWishlistGames}
                  onAddToBacklog={handleAddToBacklog}
                />
              </TabsContent>
              
              <TabsContent value="sales" className="space-y-6">
                <WishlistCard 
                  title="Games on Sale" 
                  games={onSaleGames}
                  onAddToBacklog={handleAddToBacklog}
                />
              </TabsContent>
              
              <TabsContent value="free" className="space-y-6">
                <WishlistCard 
                  title="Free Games" 
                  games={freeGames}
                  onAddToBacklog={handleAddToBacklog}
                />
              </TabsContent>
              
              <TabsContent value="backlog" className="space-y-6">
                <div className="dashboard-card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Library className="h-5 w-5 text-gaming-primary" />
                      My Backlog
                    </h2>
                    <span className="text-sm text-gaming-muted-foreground">
                      {backlogGames.length} {backlogGames.length === 1 ? 'game' : 'games'}
                    </span>
                  </div>
                  
                  {backlogGames.length === 0 ? (
                    <div className="text-center py-8 text-gaming-muted-foreground">
                      <p>No games in your backlog yet!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {backlogGames.map(game => (
                        <BacklogItem key={game.id} game={game} />
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Notification Center */}
          <div className="md:col-span-1">
            <NotificationCenter 
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
            
            {/* Platform Linking Section */}
            <div className="dashboard-card mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 text-gaming-primary" />
                  Platform Accounts
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 rounded-lg border border-gaming-steam/30 bg-gaming-steam/10">
                  <div className="flex items-center gap-2">
                    <div className="platform-badge steam">Steam</div>
                    <span className="text-sm">Connected</span>
                  </div>
                  <button className="text-xs text-gaming-muted-foreground hover:text-white">
                    Refresh
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg border border-gaming-gog/30 bg-gaming-gog/10">
                  <div className="flex items-center gap-2">
                    <div className="platform-badge gog">GOG</div>
                    <span className="text-sm">Connected</span>
                  </div>
                  <button className="text-xs text-gaming-muted-foreground hover:text-white">
                    Refresh
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg border border-gaming-muted/30 bg-gaming-muted/10">
                  <div className="flex items-center gap-2">
                    <div className="platform-badge epic">Epic</div>
                    <span className="text-sm text-gaming-muted-foreground">Not connected</span>
                  </div>
                  <button className="text-xs text-gaming-primary hover:text-gaming-primary/80">
                    Connect
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-2 rounded-lg border border-gaming-muted/30 bg-gaming-muted/10">
                  <div className="flex items-center gap-2">
                    <div className="platform-badge amazon">Amazon</div>
                    <span className="text-sm text-gaming-muted-foreground">Not connected</span>
                  </div>
                  <button className="text-xs text-gaming-primary hover:text-gaming-primary/80">
                    Connect
                  </button>
                </div>
              </div>
              
              <button className="w-full mt-4 text-sm text-gaming-primary flex items-center justify-center gap-1 p-2 border border-dashed border-gaming-primary/30 rounded-lg hover:bg-gaming-primary/10">
                <ListPlus className="h-4 w-4" />
                Add Platform
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
