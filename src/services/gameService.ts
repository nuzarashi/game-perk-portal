
import { supabase } from '@/integrations/supabase/client';
import { Game } from '@/components/GameCard';
import { BacklogGame } from '@/components/BacklogItem';
import { Notification } from '@/components/NotificationCenter';

// Get wishlisted games for the current user
export const getWishlistedGames = async (): Promise<Game[]> => {
  const { data: wishlistItems, error: wishlistError } = await supabase
    .from('wishlists')
    .select('*, games(*)')
    .order('added_at', { ascending: false });

  if (wishlistError) {
    console.error('Error fetching wishlist:', wishlistError);
    return [];
  }

  // Also get backlog items to mark wishlist games that are already in backlog
  const { data: backlogItems, error: backlogError } = await supabase
    .from('backlogs')
    .select('game_id');

  if (backlogError) {
    console.error('Error fetching backlog:', backlogError);
  }

  const backlogGameIds = new Set(backlogItems?.map(item => item.game_id) || []);

  // Convert to the Game interface
  return wishlistItems.map(item => {
    const game = item.games;
    return {
      id: game.id,
      title: game.title,
      imageUrl: game.image_url || '',
      platform: game.platform,
      status: game.is_free ? 'free' : (game.is_on_sale ? 'sale' : null),
      discount: game.discount_percentage ? `-${game.discount_percentage}%` : undefined,
      originalPrice: game.original_price ? `$${game.original_price}` : undefined,
      salePrice: game.sale_price ? `$${game.sale_price}` : undefined,
      inBacklog: backlogGameIds.has(game.id)
    };
  });
};

// Get backlog games for the current user
export const getBacklogGames = async (): Promise<BacklogGame[]> => {
  const { data: backlogItems, error } = await supabase
    .from('backlogs')
    .select('*, games(*)')
    .order('added_at', { ascending: false });

  if (error) {
    console.error('Error fetching backlog:', error);
    return [];
  }

  // Convert to the BacklogGame interface
  return backlogItems.map(item => {
    const game = item.games;
    return {
      id: game.id,
      title: game.title,
      imageUrl: game.image_url || '',
      platform: game.platform,
      hoursPlayed: item.hours_played || 0,
      lastPlayed: item.last_played ? new Date(item.last_played) : undefined,
      priority: item.priority || 'medium',
      progress: item.progress || 0
    };
  });
};

// Get notifications for the current user
export const getNotifications = async (): Promise<Notification[]> => {
  const { data: notificationItems, error } = await supabase
    .from('notifications')
    .select('*, games(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  // Convert to the Notification interface
  return notificationItems.map(item => {
    const game = item.games;
    return {
      id: item.id,
      type: item.type,
      title: item.title,
      message: item.message,
      timestamp: new Date(item.created_at),
      read: item.is_read,
      platformIcon: game.platform
    };
  });
};

// Add game to wishlist
export const addToWishlist = async (gameId: string): Promise<void> => {
  const { error } = await supabase
    .from('wishlists')
    .insert({ game_id: gameId });

  if (error) {
    console.error('Error adding to wishlist:', error);
    throw error;
  }
};

// Remove game from wishlist
export const removeFromWishlist = async (gameId: string): Promise<void> => {
  const { error } = await supabase
    .from('wishlists')
    .delete()
    .eq('game_id', gameId);

  if (error) {
    console.error('Error removing from wishlist:', error);
    throw error;
  }
};

// Add game to backlog
export const addToBacklog = async (gameId: string): Promise<void> => {
  const { error } = await supabase
    .from('backlogs')
    .insert({ game_id: gameId });

  if (error) {
    console.error('Error adding to backlog:', error);
    throw error;
  }
};

// Remove game from backlog
export const removeFromBacklog = async (gameId: string): Promise<void> => {
  const { error } = await supabase
    .from('backlogs')
    .delete()
    .eq('game_id', gameId);

  if (error) {
    console.error('Error removing from backlog:', error);
    throw error;
  }
};

// Update backlog game
export const updateBacklogGame = async (
  gameId: string, 
  updates: { hoursPlayed?: number; progress?: number; priority?: string; lastPlayed?: Date }
): Promise<void> => {
  const { error } = await supabase
    .from('backlogs')
    .update({
      hours_played: updates.hoursPlayed,
      progress: updates.progress,
      priority: updates.priority,
      last_played: updates.lastPlayed?.toISOString()
    })
    .eq('game_id', gameId);

  if (error) {
    console.error('Error updating backlog game:', error);
    throw error;
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

// Add a new game
export const addGame = async (
  gameData: {
    title: string;
    platform: string;
    imageUrl?: string;
    originalPrice?: number;
    salePrice?: number;
    isFree?: boolean;
    isOnSale?: boolean;
    discountPercentage?: number;
    sourceUrl?: string;
  }
): Promise<string> => {
  const { data, error } = await supabase
    .from('games')
    .insert({
      title: gameData.title,
      platform: gameData.platform,
      image_url: gameData.imageUrl,
      original_price: gameData.originalPrice,
      sale_price: gameData.salePrice,
      is_free: gameData.isFree || false,
      is_on_sale: gameData.isOnSale || false,
      discount_percentage: gameData.discountPercentage,
      source_url: gameData.sourceUrl
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error adding game:', error);
    throw error;
  }

  return data.id;
};
