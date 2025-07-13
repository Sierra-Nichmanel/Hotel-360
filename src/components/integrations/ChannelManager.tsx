
import React, { useState } from 'react';
import { Check, X, ExternalLink, RefreshCcw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Channel {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync?: string;
  status: 'active' | 'inactive' | 'error';
}

export function ChannelManager() {
  const [channels, setChannels] = useState<Channel[]>([
    {
      id: 'booking',
      name: 'Booking.com',
      logo: 'https://cf.bstatic.com/static/img/b26logo/booking_logo_retina/22615963add19ac6b6d715a97c8d477e648c7c6c.png',
      connected: false,
      status: 'inactive'
    },
    {
      id: 'expedia',
      name: 'Expedia',
      logo: 'https://a.travel-assets.com/pricing-claim/expedia_logo.svg',
      connected: false,
      status: 'inactive'
    },
    {
      id: 'airbnb',
      name: 'Airbnb',
      logo: 'https://a0.muscache.com/airbnb/static/logotype_favicon-21cc8e6c6a2cca43f061d2dcabdf6e58.ico',
      connected: false,
      status: 'inactive'
    },
    {
      id: 'tripadvisor',
      name: 'TripAdvisor',
      logo: 'https://static.tacdn.com/favicon.ico',
      connected: false,
      status: 'inactive'
    },
    {
      id: 'hotels',
      name: 'Hotels.com',
      logo: 'https://a.cdn-hotels.com/images/common/brands/hs/favicon.ico',
      connected: false,
      status: 'inactive'
    }
  ]);

  const [syncing, setSyncing] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === id) {
        toast.success(`Connected to ${channel.name}`);
        return {
          ...channel,
          connected: true,
          lastSync: new Date().toISOString(),
          status: 'active'
        };
      }
      return channel;
    }));
  };

  const handleDisconnect = (id: string) => {
    setChannels(channels.map(channel => {
      if (channel.id === id) {
        toast.info(`Disconnected from ${channel.name}`);
        return {
          ...channel,
          connected: false,
          status: 'inactive'
        };
      }
      return channel;
    }));
  };

  const handleSync = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setChannels(channels.map(channel => {
        if (channel.id === id) {
          toast.success(`Synced with ${channel.name}`);
          return {
            ...channel,
            lastSync: new Date().toISOString()
          };
        }
        return channel;
      }));
      setSyncing(null);
    }, 2000);
  };

  const getStatusBadge = (status: 'active' | 'inactive' | 'error') => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Channel Manager</h2>
          <p className="text-muted-foreground">Connect and manage your Online Travel Agency (OTA) integrations</p>
        </div>
        <Button>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Sync All Channels
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id} className={channel.connected ? "border-green-200" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <img
                  src={channel.logo}
                  alt={`${channel.name} logo`}
                  className="h-6 w-6 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
                <CardTitle className="text-md font-medium">{channel.name}</CardTitle>
              </div>
              {getStatusBadge(channel.status)}
            </CardHeader>
            <CardContent>
              <div className="grid gap-1">
                {channel.connected && channel.lastSync && (
                  <p className="text-xs text-muted-foreground">
                    Last synced: {new Date(channel.lastSync).toLocaleString()}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={channel.connected}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleConnect(channel.id);
                    } else {
                      handleDisconnect(channel.id);
                    }
                  }}
                />
                <span className="text-sm text-muted-foreground">
                  {channel.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex space-x-2">
                {channel.connected && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSync(channel.id)}
                    disabled={syncing === channel.id}
                  >
                    {syncing === channel.id ? (
                      <>
                        <RefreshCcw className="mr-2 h-3 w-3 animate-spin" />
                        Syncing...
                      </>
                    ) : (
                      <>
                        <RefreshCcw className="mr-2 h-3 w-3" />
                        Sync
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
