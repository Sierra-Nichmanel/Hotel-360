
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '../hooks/use-toast';
import { db, syncWithCloud } from './db';

interface NetworkContextType {
  isOnline: boolean;
  isConnecting: boolean;
  checkConnection: () => Promise<boolean>;
  syncNow: () => Promise<void>;
  isSyncing: boolean;
  lastSynced: Date | null;
  hasConnectedBefore: boolean;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(
    localStorage.getItem('hospitify_last_synced') 
      ? new Date(localStorage.getItem('hospitify_last_synced')!) 
      : null
  );
  const [hasConnectedBefore, setHasConnectedBefore] = useState<boolean>(
    localStorage.getItem('hospitify_has_connected') === 'true'
  );

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: "Connected to server successfully",
      });
      
      // Auto-sync when coming back online
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "The app will continue to work and sync when you're back online",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection status on initial load
    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Function to actively check connection to server
  const checkConnection = async (): Promise<boolean> => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return false;
    }

    setIsConnecting(true);
    
    try {
      // Attempt to fetch a lightweight resource to verify connection
      const response = await fetch('/api/heartbeat', { 
        method: 'HEAD',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      const connectionSuccess = response.ok;
      setIsOnline(connectionSuccess);
      
      if (connectionSuccess) {
        setHasConnectedBefore(true);
        localStorage.setItem('hospitify_has_connected', 'true');
      } else {
        toast({
          title: "Server connection issue",
          description: "Connected to internet but can't reach server",
          variant: "destructive",
        });
      }
      
      return connectionSuccess;
    } catch (error) {
      console.error('Connection check error:', error);
      setIsOnline(false);
      
      toast({
        title: "Working offline",
        description: "App is running in offline mode",
        variant: "default",
      });
      
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // Function to manually sync data with the server
  const syncNow = async (): Promise<void> => {
    if (!isOnline) {
      toast({
        title: "Cannot sync while offline",
        description: "Please check your internet connection and try again",
        variant: "destructive",
      });
      return;
    }

    if (isSyncing) {
      toast({
        title: "Sync already in progress",
        description: "Please wait for the current sync to complete",
      });
      return;
    }

    setIsSyncing(true);
    
    try {
      // Perform the actual data synchronization
      const syncedItems = await syncWithCloud();
      
      // Update last synced timestamp
      const now = new Date();
      setLastSynced(now);
      localStorage.setItem('hospitify_last_synced', now.toISOString());
      
      toast({
        title: "Sync completed",
        description: `${syncedItems} items synchronized with the server`,
      });
    } catch (error) {
      console.error('Sync error:', error);
      
      toast({
        title: "Sync failed",
        description: "Unable to synchronize data with the server",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Set up periodic sync when online
  useEffect(() => {
    let syncInterval: number | undefined;
    
    if (isOnline) {
      // Sync every 5 minutes when online (300000ms)
      syncInterval = window.setInterval(() => {
        syncNow();
      }, 300000);
    }
    
    return () => {
      if (syncInterval) {
        clearInterval(syncInterval);
      }
    };
  }, [isOnline]);

  return (
    <NetworkContext.Provider value={{ 
      isOnline, 
      isConnecting, 
      checkConnection,
      syncNow,
      isSyncing,
      lastSynced,
      hasConnectedBefore
    }}>
      {children}
    </NetworkContext.Provider>
  );
}

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error('useNetwork must be used within a NetworkProvider');
  }
  return context;
};
