
import React, { useState } from 'react';
import { 
  Cloud, Map, Calendar, Bus, Plane, AlertTriangle, 
  ArrowRightCircle, RefreshCw
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { toast } from 'sonner';

interface ExternalApi {
  id: string;
  name: string;
  category: 'weather' | 'maps' | 'events' | 'transportation';
  enabled: boolean;
  apiKey?: string;
  url: string;
  description: string;
  statusMessage?: string;
  lastChecked?: string;
}

export function ExternalApis() {
  const [apis, setApis] = useState<ExternalApi[]>([
    {
      id: 'openweather',
      name: 'OpenWeather API',
      category: 'weather',
      enabled: false,
      url: 'https://openweathermap.org/api',
      description: 'Get current weather and forecasts for your hotel location',
      statusMessage: 'Not configured'
    },
    {
      id: 'googlemaps',
      name: 'Google Maps',
      category: 'maps',
      enabled: true,
      apiKey: '************DEMO',
      url: 'https://developers.google.com/maps',
      description: 'Display maps and directions for guests',
      statusMessage: 'Connected',
      lastChecked: '2023-05-15T10:30:00Z'
    },
    {
      id: 'ticketmaster',
      name: 'Ticketmaster Events',
      category: 'events',
      enabled: false,
      url: 'https://developer.ticketmaster.com/',
      description: 'Show local events and attractions for guests',
      statusMessage: 'Not configured'
    },
    {
      id: 'uber',
      name: 'Uber Transportation',
      category: 'transportation',
      enabled: false,
      url: 'https://developer.uber.com/',
      description: 'Allow guests to book rides directly from your site',
      statusMessage: 'Not configured'
    }
  ]);

  const [selectedApi, setSelectedApi] = useState<ExternalApi | null>(null);
  const [apiKey, setApiKey] = useState('');

  const handleSaveApiKey = () => {
    if (!selectedApi) return;
    
    setApis(apis.map(api => {
      if (api.id === selectedApi.id) {
        toast.success(`${api.name} API key saved successfully`);
        return {
          ...api,
          apiKey: apiKey,
          enabled: true,
          statusMessage: 'Connected',
          lastChecked: new Date().toISOString()
        };
      }
      return api;
    }));
    
    setSelectedApi(null);
    setApiKey('');
  };

  const handleToggleApi = (id: string) => {
    setApis(apis.map(api => {
      if (api.id === id) {
        const newState = {...api, enabled: !api.enabled};
        
        if (!api.apiKey && !api.enabled) {
          toast.error(`Please configure ${api.name} before enabling`);
          return api;
        }
        
        if (newState.enabled) {
          toast.success(`${api.name} enabled`);
          return {
            ...newState,
            statusMessage: 'Connected',
            lastChecked: new Date().toISOString()
          };
        } else {
          toast.info(`${api.name} disabled`);
          return {
            ...newState,
            statusMessage: 'Disabled'
          };
        }
      }
      return api;
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'weather':
        return <Cloud className="h-5 w-5" />;
      case 'maps':
        return <Map className="h-5 w-5" />;
      case 'events':
        return <Calendar className="h-5 w-5" />;
      case 'transportation':
        return <Bus className="h-5 w-5" />;
      default:
        return <Cloud className="h-5 w-5" />;
    }
  };

  const testApi = (id: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Testing API connection...',
        success: (data) => {
          setApis(apis.map(api => {
            if (api.id === id) {
              return {
                ...api,
                lastChecked: new Date().toISOString()
              };
            }
            return api;
          }));
          return 'API connection successful';
        },
        error: 'API connection failed',
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">External APIs</h2>
        <p className="text-muted-foreground">Connect to external services for weather, events, transportation, and more</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((api) => (
          <Card key={api.id} className={api.enabled ? "border-green-200" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  {getCategoryIcon(api.category)}
                </div>
                <div>
                  <CardTitle className="text-lg">{api.name}</CardTitle>
                  <CardDescription className="text-xs">{api.category.charAt(0).toUpperCase() + api.category.slice(1)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{api.description}</p>
              
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Status: </span>
                  <span className={api.enabled ? "text-green-500" : "text-muted-foreground"}>
                    {api.statusMessage}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedApi(api)}>
                        Configure
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Configure {api.name}</DialogTitle>
                        <DialogDescription>
                          Enter your API key to enable this integration.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <p className="text-sm">
                            You can get an API key from:
                            <a 
                              href={api.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="ml-1 text-blue-500 hover:underline inline-flex items-center"
                            >
                              {api.url.replace('https://', '')}
                              <ArrowRightCircle className="h-3 w-3 ml-1" />
                            </a>
                          </p>
                          <Input
                            placeholder="Enter API Key"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedApi(null)}>Cancel</Button>
                        <Button onClick={handleSaveApiKey} disabled={!apiKey}>Save API Key</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Switch
                    checked={api.enabled}
                    onCheckedChange={() => handleToggleApi(api.id)}
                    disabled={!api.apiKey}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-3">
              <div className="flex justify-between items-center w-full">
                <div className="text-xs text-muted-foreground">
                  {api.lastChecked ? (
                    <>Last checked: {new Date(api.lastChecked).toLocaleString()}</>
                  ) : (
                    <>Not checked yet</>
                  )}
                </div>
                
                {api.enabled && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testApi(api.id)}
                    className="h-7 text-xs"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Test Connection
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
