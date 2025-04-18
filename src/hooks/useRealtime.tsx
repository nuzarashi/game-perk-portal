
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/sonner';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Enable realtime on the database tables
    const runEnableRealtimeQuery = async () => {
      await supabase.rpc('enable_realtime', {
        table_name: 'games'
      });
      await supabase.rpc('enable_realtime', {
        table_name: 'wishlists'
      });
      await supabase.rpc('enable_realtime', {
        table_name: 'backlogs'
      });
      await supabase.rpc('enable_realtime', {
        table_name: 'notifications'
      });
    };

    runEnableRealtimeQuery();

    // Subscribe to notifications table - show toast for new notifications
    const notificationChannel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          // Refresh the notifications query
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
          
          // Show a toast notification
          const notification = payload.new;
          toast.info(notification.title, {
            description: notification.message,
            duration: 5000,
          });
        }
      )
      .subscribe();

    // Subscribe to games table - refresh games when prices change
    const gamesChannel = supabase
      .channel('games-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'games'
        },
        () => {
          // Refresh the games queries
          queryClient.invalidateQueries({ queryKey: ['wishlistGames'] });
          queryClient.invalidateQueries({ queryKey: ['backlogGames'] });
        }
      )
      .subscribe();

    // Subscribe to wishlists table - refresh games when wishlist changes
    const wishlistsChannel = supabase
      .channel('wishlists-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // All events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'wishlists'
        },
        () => {
          // Refresh the wishlist query
          queryClient.invalidateQueries({ queryKey: ['wishlistGames'] });
        }
      )
      .subscribe();

    // Subscribe to backlogs table - refresh games when backlog changes
    const backlogsChannel = supabase
      .channel('backlogs-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // All events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'backlogs'
        },
        () => {
          // Refresh the backlog query
          queryClient.invalidateQueries({ queryKey: ['backlogGames'] });
        }
      )
      .subscribe();

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(gamesChannel);
      supabase.removeChannel(wishlistsChannel);
      supabase.removeChannel(backlogsChannel);
    };
  }, [queryClient]);
}

export default useRealtimeUpdates;
