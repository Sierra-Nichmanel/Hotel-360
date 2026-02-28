
import React, { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';
import { Bell, X, Check, Clock, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/language-context';
import { db, Booking, Guest, Room } from '@/lib/db';
import { differenceInDays, format, isAfter, isBefore, addDays } from 'date-fns';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';

// Type definitions for notification system
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  isRead: boolean;
  entityId?: number;
  entityType?: 'booking' | 'guest' | 'room' | 'task';
  action?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  sendReminder: (bookingId: number, type: 'check-in' | 'check-out') => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotification: () => {},
  clearAllNotifications: () => {},
  addNotification: () => {},
  sendReminder: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { t } = useLanguage();

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications from local storage on initial load
  useEffect(() => {
    const savedNotifications = localStorage.getItem('hotelNotifications');
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        // Convert string timestamps back to Date objects
        const notificationsWithDates = parsedNotifications.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error('Error parsing notifications:', error);
      }
    }
  }, []);

  // Save notifications to local storage when they change
  useEffect(() => {
    localStorage.setItem('hotelNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Check for upcoming check-ins and check-outs
  useEffect(() => {
    const checkForReminders = async () => {
      try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const tomorrow = addDays(today, 1);
        
        // Get all active bookings
        const bookings = await db.bookings.where('status').equals('confirmed').toArray();
        
        // Check for upcoming check-ins (tomorrow)
        const upcomingCheckIns = bookings.filter(booking => {
          const checkInDate = new Date(booking.checkInDate);
          checkInDate.setHours(0, 0, 0, 0);
          return checkInDate.getTime() === tomorrow.getTime();
        });
        
        // Check for upcoming check-outs (tomorrow)
        const upcomingCheckOuts = bookings.filter(booking => {
          const checkOutDate = new Date(booking.checkOutDate);
          checkOutDate.setHours(0, 0, 0, 0);
          return checkOutDate.getTime() === tomorrow.getTime() && booking.status === 'checked_in';
        });
        
        // Create notifications for upcoming check-ins
        for (const booking of upcomingCheckIns) {
          const guest = await db.guests.get(booking.guestId);
          const room = await db.rooms.get(booking.roomId);
          
          if (guest && room) {
            // Check if we already have a notification for this booking
            const existingNotification = notifications.find(
              n => n.entityId === booking.id && 
                  n.entityType === 'booking' && 
                  n.type === 'info' &&
                  n.action === 'check-in-reminder'
            );
            
            if (!existingNotification) {
              addNotification({
                title: t('Upcoming Check-In'),
                message: `${guest.firstName} ${guest.lastName} is checking in to Room ${room.number} tomorrow.`,
                type: 'info',
                entityId: booking.id as number,
                entityType: 'booking',
                action: 'check-in-reminder',
              });
            }
          }
        }
        
        // Create notifications for upcoming check-outs
        for (const booking of upcomingCheckOuts) {
          const guest = await db.guests.get(booking.guestId);
          const room = await db.rooms.get(booking.roomId);
          
          if (guest && room) {
            // Check if we already have a notification for this booking
            const existingNotification = notifications.find(
              n => n.entityId === booking.id && 
                  n.entityType === 'booking' && 
                  n.type === 'info' &&
                  n.action === 'check-out-reminder'
            );
            
            if (!existingNotification) {
              addNotification({
                title: t('Upcoming Check-Out'),
                message: `${guest.firstName} ${guest.lastName} is checking out from Room ${room.number} tomorrow.`,
                type: 'info',
                entityId: booking.id as number,
                entityType: 'booking',
                action: 'check-out-reminder',
              });
            }
          }
        }
      } catch (error) {
        console.error('Error checking for reminders:', error);
      }
    };
    
    // Run immediately on mount
    checkForReminders();
    
    // Then set up interval to check daily (for demo purposes, we'll check every minute)
    const intervalId = setInterval(checkForReminders, 60000); // every minute
    
    return () => clearInterval(intervalId);
  }, [notifications, t]);

  // Add a new notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show a toast for the new notification
    toast(notification.title, {
      description: notification.message,
      duration: 5000,
    });
  };

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Clear a notification
  const clearNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Send a reminder for a booking
  const sendReminder = async (bookingId: number, type: 'check-in' | 'check-out') => {
    try {
      const booking = await db.bookings.get(bookingId);
      
      if (!booking) {
        toast.error(t('Booking not found'));
        return;
      }
      
      const guest = await db.guests.get(booking.guestId);
      const room = await db.rooms.get(booking.roomId);
      
      if (!guest || !room) {
        toast.error(t('Guest or room information not found'));
        return;
      }
      
      // In a real application, this would send an email or SMS
      // Here we'll just add a notification to simulate it
      
      let title = '';
      let message = '';
      
      if (type === 'check-in') {
        title = t('Check-In Reminder Sent');
        message = `A check-in reminder has been sent to ${guest.firstName} ${guest.lastName} for their stay in Room ${room.number} on ${format(new Date(booking.checkInDate), 'PPP')}.`;
      } else {
        title = t('Check-Out Reminder Sent');
        message = `A check-out reminder has been sent to ${guest.firstName} ${guest.lastName} for their departure from Room ${room.number} on ${format(new Date(booking.checkOutDate), 'PPP')}.`;
      }
      
      addNotification({
        title,
        message,
        type: 'success',
        entityId: bookingId,
        entityType: 'booking',
        action: `${type}-reminder-sent`,
      });
      
      toast.success(t('Reminder sent successfully'));
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error(t('Failed to send reminder'));
    }
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    addNotification,
    sendReminder,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// The notification bell icon component with popover
export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">{t("Notifications")}</h3>
          {notifications.length > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-8 text-xs">
              {t("Mark all as read")}
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length > 0 ? (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex gap-3 p-3 hover:bg-muted/50 cursor-pointer",
                    !notification.isRead && "bg-muted/20"
                  )}
                  onClick={() => {
                    if (!notification.isRead) {
                      markAsRead(notification.id);
                    }
                  }}
                >
                  <div className="flex-shrink-0 mt-1">
                    {notification.type === 'success' ? (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600" />
                      </div>
                    ) : notification.type === 'warning' ? (
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-amber-600" />
                      </div>
                    ) : notification.type === 'error' ? (
                      <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                        <X className="h-4 w-4 text-red-600" />
                      </div>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Info className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{notification.title}</p>
                      <button 
                        className="h-5 w-5 rounded-full hover:bg-muted flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(notification.timestamp, 'PPp')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{t("No Notifications")}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("You don't have any notifications at the moment")}
              </p>
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

// Component for sending reminders for bookings
export function BookingReminders({ bookingId }: { bookingId: number }) {
  const { sendReminder } = useNotifications();
  const { t } = useLanguage();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [guest, setGuest] = useState<Guest | null>(null);
  
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const bookingData = await db.bookings.get(bookingId);
        if (bookingData) {
          setBooking(bookingData);
          
          const guestData = await db.guests.get(bookingData.guestId);
          if (guestData) {
            setGuest(guestData);
          }
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };
    
    fetchBookingDetails();
  }, [bookingId]);
  
  if (!booking || !guest) {
    return null;
  }
  
  return (
    <Card className="p-4 space-y-4">
      <h3 className="text-sm font-medium">{t("Send Reminders")}</h3>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 justify-start"
          onClick={() => sendReminder(bookingId, 'check-in')}
        >
          <Clock className="mr-2 h-4 w-4" />
          {t("Send Check-in Reminder")}
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 justify-start"
          onClick={() => sendReminder(bookingId, 'check-out')}
        >
          <Clock className="mr-2 h-4 w-4" />
          {t("Send Check-out Reminder")}
        </Button>
      </div>
    </Card>
  );
}
