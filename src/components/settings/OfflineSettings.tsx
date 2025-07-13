
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw, Database, WifiOff, Download } from "lucide-react";
import { useState } from "react";
import { useNetwork } from "@/lib/network-context";
import { db } from "@/lib/db";
import { toast } from "@/hooks/use-toast";

export function OfflineSettings() {
  const { isOnline, syncNow, isSyncing, lastSynced, checkConnection } = useNetwork();
  const [isClearing, setIsClearing] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(
    localStorage.getItem('hospitify_auto_sync') !== 'false'
  );
  
  const handleToggleAutoSync = (checked: boolean) => {
    setAutoSyncEnabled(checked);
    localStorage.setItem('hospitify_auto_sync', String(checked));
    
    toast({
      title: checked ? "Auto sync enabled" : "Auto sync disabled",
      description: checked 
        ? "Data will automatically sync when online" 
        : "Data will only sync when manually triggered",
    });
  };
  
  const handleClearLocalData = async () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      setIsClearing(true);
      try {
        // Clear all tables except users
        await db.tasks.clear();
        await db.rooms.clear();
        await db.guests.clear();
        await db.bookings.clear();
        await db.payments.clear();
        await db.invoices.clear();
        await db.invoiceItems.clear();
        await db.staff.clear();
        await db.shifts.clear();
        await db.inventoryItems.clear();
        await db.inventoryLogs.clear();
        await db.syncLogs.clear();
        
        toast({
          title: "Local data cleared",
          description: "All local data has been cleared successfully",
        });
      } catch (error) {
        console.error('Error clearing data:', error);
        toast({
          title: "Error",
          description: "Failed to clear local data",
          variant: "destructive",
        });
      } finally {
        setIsClearing(false);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Offline Mode</CardTitle>
        <CardDescription>
          Manage offline capabilities and data synchronization settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Connection Status */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Connection Status</h3>
              <p className="text-sm text-muted-foreground">
                {isOnline ? 'Connected to server' : 'Offline mode active'}
              </p>
            </div>
            <Button 
              variant={isOnline ? "outline" : "default"} 
              onClick={() => checkConnection()}
              className="flex items-center"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Connection
            </Button>
          </div>
          
          {isOnline && (
            <div className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 p-3 rounded-md flex items-center text-sm">
              <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400 mr-2"></div>
              Connected to server
            </div>
          )}
          
          {!isOnline && (
            <div className="bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 p-3 rounded-md flex items-center text-sm">
              <WifiOff className="h-4 w-4 mr-2" />
              Operating in offline mode. All changes will be synchronized when you're back online.
            </div>
          )}
        </div>

        {/* Last Synced */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Data Synchronization</h3>
              <p className="text-sm text-muted-foreground">
                {lastSynced 
                  ? `Last synced: ${lastSynced.toLocaleString()}` 
                  : 'Never synced'}
              </p>
            </div>
            <Button 
              onClick={() => syncNow()} 
              disabled={isSyncing || !isOnline}
              variant="outline"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Sync Now
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Auto-sync Setting */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-sync">Auto Synchronization</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync data when the app comes online
              </p>
            </div>
            <Switch
              id="auto-sync"
              checked={autoSyncEnabled}
              onCheckedChange={handleToggleAutoSync}
            />
          </div>
        </div>

        {/* Clear Local Data */}
        <div className="border-t pt-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Clear Local Data</h3>
            <p className="text-sm text-muted-foreground">
              Remove all locally stored data. This cannot be undone.
            </p>
            <Button 
              variant="destructive"
              onClick={handleClearLocalData}
              disabled={isClearing}
              className="w-full sm:w-auto mt-2"
            >
              {isClearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : "Clear All Local Data"}
            </Button>
          </div>
        </div>
        
        {/* Install App */}
        <div className="border-t pt-4">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Install Application</h3>
            <p className="text-sm text-muted-foreground">
              Install Hospitify 360 as an app on your device for better offline access.
            </p>
            <Button 
              variant="outline"
              className="w-full sm:w-auto mt-2"
              onClick={() => {
                localStorage.removeItem('pwa_install_dismissed');
                window.location.reload();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
