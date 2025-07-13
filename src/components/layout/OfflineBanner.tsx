
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNetwork } from "@/lib/network-context";
import { WifiOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const { isOnline, syncNow, checkConnection, hasConnectedBefore } = useNetwork();
  
  // Don't show the banner if this is a fresh install and has never been online
  if (isOnline || !hasConnectedBefore) {
    return null;
  }

  return (
    <Alert variant="destructive" className="fixed bottom-0 left-0 right-0 z-50 mb-0 rounded-none border-t">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <span className="font-semibold">You're offline.</span> Data changes will be synced when you reconnect.
          </AlertDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-white text-destructive border-destructive hover:bg-destructive/10"
          onClick={() => checkConnection()}
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reconnect
        </Button>
      </div>
    </Alert>
  );
}
