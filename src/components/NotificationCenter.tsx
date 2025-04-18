
import React from 'react';
import { Bell, Gift, Tag, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Notification {
  id: string;
  type: 'sale' | 'free' | 'backlog';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  platformIcon: 'steam' | 'epic' | 'gog' | 'amazon';
}

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ 
  notifications,
  onMarkAsRead
}) => {
  return (
    <div className="dashboard-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gaming-primary" />
          <h2 className="text-xl font-bold">Notifications</h2>
        </div>
        <span className="text-sm text-gaming-primary font-medium">
          {notifications.filter(n => !n.read).length} new
        </span>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-8 text-gaming-muted-foreground">
          <p>No notifications yet!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={cn(
                "p-3 rounded-lg border transition-colors",
                !notification.read 
                  ? "bg-gaming-muted/20 border-gaming-primary/30" 
                  : "bg-gaming-card border-gaming-muted/30",
              )}
              onClick={() => onMarkAsRead(notification.id)}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                  notification.type === 'sale' ? "bg-gaming-sale/20" :
                  notification.type === 'free' ? "bg-gaming-free/20" :
                  "bg-gaming-primary/20"
                )}>
                  {notification.type === 'sale' && <Tag className="h-5 w-5 text-gaming-sale" />}
                  {notification.type === 'free' && <Gift className="h-5 w-5 text-gaming-free" />}
                  {notification.type === 'backlog' && <ThumbsUp className="h-5 w-5 text-gaming-primary" />}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium text-white">{notification.title}</h4>
                  <p className="text-sm text-gaming-muted-foreground">{notification.message}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <div className={cn("platform-badge", notification.platformIcon)}>
                      {notification.platformIcon.charAt(0).toUpperCase() + notification.platformIcon.slice(1)}
                    </div>
                    <span className="text-xs text-gaming-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffMinutes = Math.floor(diffTime / (1000 * 60));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString();
}

export default NotificationCenter;
