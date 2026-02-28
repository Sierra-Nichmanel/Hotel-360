
import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { useNetwork } from '@/lib/network-context';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface PageHeaderProps {
  title?: string;
  heading?: string;
  description?: string;
  icon?: React.ReactNode;
  showSyncStatus?: boolean;
}

export function PageHeader({ title, heading, description, icon, showSyncStatus = false }: PageHeaderProps) {
  const { isOnline, isSyncing, syncNow, lastSynced } = useNetwork();
  
  // Use heading as fallback for title and vice versa
  const displayTitle = title || heading || "";
  
  // Format the last synced time
  const formattedLastSynced = lastSynced ? new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true
  }).format(lastSynced) : 'Never';

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        {icon && <div className="text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-semibold">{displayTitle}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      
      {showSyncStatus && (
        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground hidden md:block">
            {isOnline ? 
              `Last synced: ${formattedLastSynced}` : 
              "Offline mode"
            }
          </div>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => syncNow()}
                disabled={!isOnline || isSyncing}
                className="gap-1"
              >
                {isSyncing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : isOnline ? (
                  <Cloud className="h-4 w-4" />
                ) : (
                  <CloudOff className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isOnline 
                ? (isSyncing 
                    ? 'Synchronizing data with server...' 
                    : 'Manually sync data with server')
                : 'Cannot sync while offline'
              }
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
