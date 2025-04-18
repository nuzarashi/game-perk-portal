
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import PlatformSelector from '@/components/PlatformSelector';
import WishlistCard from '@/components/WishlistCard';
import BacklogItem, { BacklogGame } from '@/components/BacklogItem';
import { Game } from '@/components/GameCard';
import NotificationCenter, { Notification } from '@/components/NotificationCenter';
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

// Mock data
const mockWishlistGames: Game[] = [
  {
    id: '1',
    title: 'Cyberpunk 2077',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg',
    platform: 'steam',
    status: 'sale',
    discount: '-50%',
    originalPrice: '$59.99',
    salePrice: '$29.99',
    inBacklog: false
  },
  {
    id: '2',
    title: 'God of War',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg',
    platform: 'epic',
    status: null,
    inBacklog: true
  },
  {
    id: '3',
    title: 'Starfield',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1716740/capsule_616x353.jpg',
    platform: 'steam',
    status: null,
    inBacklog: false
  },
  {
    id: '4',
    title: 'Baldur\'s Gate 3',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg',
    platform: 'gog',
    status: 'free',
    inBacklog: true
  },
  {
    id: '5',
    title: 'The Witcher 3: Wild Hunt',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/292030/capsule_616x353.jpg',
    platform: 'amazon',
    status: 'sale',
    discount: '-70%',
    originalPrice: '$39.99',
    salePrice: '$11.99',
    inBacklog: false
  }
];

const mockBacklogGames: BacklogGame[] = [
  {
    id: '1',
    title: 'God of War',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1593500/capsule_616x353.jpg',
    platform: 'epic',
    hoursPlayed: 12,
    lastPlayed: new Date('2023-11-15'),
    priority: 'high',
    progress: 45
  },
  {
    id: '2',
    title: 'Baldur\'s Gate 3',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1086940/capsule_616x353.jpg',
    platform: 'gog',
    hoursPlayed: 50,
    lastPlayed: new Date('2023-12-20'),
    priority: 'medium',
    progress: 75
  },
  {
    id: '3',
    title: 'Hades',
    imageUrl: 'https://cdn.akamai.steamstatic.com/steam/apps/1145360/capsule_616x353.jpg',
    platform: 'steam',
    hoursPlayed: 3,
    priority: 'low',
    progress: 15
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'sale',
    title: 'Cyberpunk 2077 is on sale!',
    message: 'Your wishlisted game is 50% off until January 30, 2024.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    platformIcon: 'steam'
  },
  {
    id: '2',
    type: 'free',
    title: 'Baldur\'s Gate 3 is free to claim!',
    message: 'Claim this game for free on GOG until tomorrow.',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    read: false,
    platformIcon: 'gog'
  },
  {
    id: '3',
    type: 'backlog',
    title: 'Play God of War',
    message: 'You haven\'t played this game in 2 weeks. Time to continue your adventure!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
    platformIcon: 'epic'
  }
];

const Index = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [wishlistGames, setWishlistGames] = useState<Game[]>(mockWishlistGames);
  const [backlogGames, setBacklogGames] = useState<BacklogGame[]>(mockBacklogGames);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // Filter games by platform if a specific one is selected
  const filteredWishlistGames = selectedPlatform === 'all' 
    ? wishlistGames
    : wishlistGames.filter(game => game.platform === selectedPlatform);
  
  // Games on sale
  const onSaleGames = wishlistGames.filter(game => game.status === 'sale');
  
  // Free games
  const freeGames = wishlistGames.filter(game => game.status === 'free');
  
  // Handle adding game to backlog
  const handleAddToBacklog = (gameId: string) => {
    setWishlistGames(prevGames => 
      prevGames.map(game => 
        game.id === gameId 
          ? { ...game, inBacklog: !game.inBacklog } 
          : game
      )
    );
  };
  
  // Handle marking notification as read
  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };
  
  // Handle adding a new game
  const handleAddGame = (gameData: any) => {
    const newGame: Game = {
      id: Date.now().toString(),
      title: gameData.title,
      imageUrl: gameData.imageUrl || '',
      platform: gameData.platform,
      status: gameData.status === 'none' ? null : gameData.status,
      inBacklog: false
    };
    
    if (gameData.status === 'sale') {
      newGame.discount = '-20%'; // Default discount
      newGame.originalPrice = gameData.price || '$59.99';
      newGame.salePrice = gameData.price || '$47.99';
    }
    
    setWishlistGames(prevGames => [newGame, ...prevGames]);
  };

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
                  Track your games, sales, and backlog across platforms
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
