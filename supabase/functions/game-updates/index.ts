
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseKey)

    // For this demo, we'll simulate updates to games (sale status, price changes)
    // In a real app, you would fetch data from Steam, Epic, etc. APIs

    // Get all games in the database
    const { data: games, error: gamesError } = await supabase
      .from('games')
      .select('*')

    if (gamesError) {
      throw gamesError
    }

    // Simulate a random price change or sale for some games
    const updatedGames = []
    for (const game of games) {
      // Randomly decide if this game should get an update (30% chance)
      if (Math.random() < 0.3) {
        const updateType = Math.floor(Math.random() * 3) // 0: no sale, 1: sale, 2: free
        
        let updateData = {}
        let notificationType = ''
        let notificationTitle = ''
        let notificationMessage = ''
        
        switch (updateType) {
          case 0: // No sale
            if (game.is_on_sale || game.is_free) {
              updateData = {
                is_on_sale: false,
                is_free: false,
                discount_percentage: null,
                sale_price: null
              }
            }
            break
          case 1: // Sale
            if (!game.is_on_sale && !game.is_free && game.original_price) {
              const discount = Math.floor(Math.random() * 4 + 1) * 10 // 10%, 20%, 30%, 40%, 50%
              const salePrice = game.original_price * (1 - discount / 100)
              
              updateData = {
                is_on_sale: true,
                is_free: false,
                discount_percentage: discount,
                sale_price: salePrice
              }
              
              notificationType = 'sale'
              notificationTitle = `${game.title} is on sale!`
              notificationMessage = `${game.title} is now ${discount}% off on ${game.platform}!`
            }
            break
          case 2: // Free
            if (!game.is_free) {
              updateData = {
                is_on_sale: false,
                is_free: true,
                discount_percentage: 100,
                sale_price: 0
              }
              
              notificationType = 'free'
              notificationTitle = `${game.title} is free!`
              notificationMessage = `${game.title} is now free to claim on ${game.platform}!`
            }
            break
        }
        
        // If we have an update, apply it
        if (Object.keys(updateData).length > 0) {
          const { data, error } = await supabase
            .from('games')
            .update(updateData)
            .eq('id', game.id)
            .select()
          
          if (error) {
            console.error('Error updating game:', error)
          } else if (data.length > 0) {
            updatedGames.push(data[0])
            
            // If this was a sale or free update, create notifications for all users who have this game in their wishlist
            if (notificationType) {
              // Get all users who have this game in their wishlist
              const { data: wishlistEntries, error: wishlistError } = await supabase
                .from('wishlists')
                .select('user_id')
                .eq('game_id', game.id)
              
              if (wishlistError) {
                console.error('Error getting wishlist entries:', wishlistError)
              } else if (wishlistEntries.length > 0) {
                // Create a notification for each user
                const notifications = wishlistEntries.map(entry => ({
                  user_id: entry.user_id,
                  game_id: game.id,
                  type: notificationType,
                  title: notificationTitle,
                  message: notificationMessage
                }))
                
                const { error: notificationError } = await supabase
                  .from('notifications')
                  .insert(notifications)
                
                if (notificationError) {
                  console.error('Error creating notifications:', notificationError)
                }
              }
            }
          }
        }
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updatedGames.length} games`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in game-updates function:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
