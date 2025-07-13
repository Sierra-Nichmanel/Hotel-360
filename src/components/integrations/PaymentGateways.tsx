
import React, { useState } from 'react';
import { 
  CreditCard, Shield, CheckCircle, AlertCircle, 
  ChevronDown, ChevronUp, Settings 
} from 'lucide-react';
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Accordion, AccordionContent, 
  AccordionItem, AccordionTrigger 
} from '@/components/ui/accordion';
import { toast } from 'sonner';

interface PaymentGateway {
  id: string;
  name: string;
  logo: string;
  configured: boolean;
  enabled: boolean;
  description: string;
  supportedMethods: string[];
  fees: string;
}

export function PaymentGateways() {
  const [gateways, setGateways] = useState<PaymentGateway[]>([
    {
      id: 'stripe',
      name: 'Stripe',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
      configured: true,
      enabled: true,
      description: 'Accept payments from customers around the world with credit cards, digital wallets, and more.',
      supportedMethods: ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay'],
      fees: '2.9% + $0.30 per transaction'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      logo: 'https://www.paypalobjects.com/webstatic/icon/pp258.png',
      configured: false,
      enabled: false,
      description: 'Accept PayPal, Venmo, credit and debit cards, and buy now, pay later options.',
      supportedMethods: ['PayPal', 'Venmo', 'Credit Cards', 'Buy Now Pay Later'],
      fees: '3.49% + $0.49 per transaction'
    },
    {
      id: 'square',
      name: 'Square',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Square%2C_Inc._logo.svg/1200px-Square%2C_Inc._logo.svg.png',
      configured: false,
      enabled: false,
      description: 'Payment processing for online and in-person payments with hardware solutions.',
      supportedMethods: ['Credit Cards', 'Debit Cards', 'Square Terminal'],
      fees: '2.6% + $0.10 per transaction'
    },
    {
      id: 'authorize',
      name: 'Authorize.net',
      logo: 'https://www.authorize.net/content/dam/anet-redesign/reseller/AN-Logo.svg',
      configured: false,
      enabled: false,
      description: 'Authorize.Net provides payment processing and payment management services.',
      supportedMethods: ['Credit Cards', 'E-checks', 'Digital Wallets'],
      fees: '2.9% + $0.30 per transaction'
    }
  ]);

  const handleToggleEnabled = (id: string) => {
    setGateways(gateways.map(gateway => {
      if (gateway.id === id) {
        if (!gateway.configured && !gateway.enabled) {
          // If trying to enable but not configured
          toast.error(`Please configure ${gateway.name} before enabling`);
          return gateway;
        }
        
        const newState = {...gateway, enabled: !gateway.enabled};
        
        if (newState.enabled) {
          toast.success(`${gateway.name} payment gateway enabled`);
        } else {
          toast.info(`${gateway.name} payment gateway disabled`);
        }
        
        return newState;
      }
      return gateway;
    }));
  };

  const handleConfigure = (id: string) => {
    setGateways(gateways.map(gateway => {
      if (gateway.id === id) {
        toast.success(`${gateway.name} configured successfully`);
        return {...gateway, configured: true};
      }
      return gateway;
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Payment Gateways</h2>
        <p className="text-muted-foreground">Configure and manage payment methods for your hotel</p>
      </div>

      <div className="space-y-4">
        {gateways.map((gateway) => (
          <Card key={gateway.id} className={gateway.enabled ? 'border-green-200' : ''}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 overflow-hidden">
                    <img
                      src={gateway.logo}
                      alt={`${gateway.name} logo`}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{gateway.name}</CardTitle>
                    <CardDescription className="text-xs">{gateway.fees}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant={gateway.configured ? "success" : "outline"}
                    className={gateway.configured ? "bg-green-500" : ""}
                  >
                    {gateway.configured ? 'Configured' : 'Not Configured'}
                  </Badge>
                  <Switch
                    checked={gateway.enabled}
                    onCheckedChange={() => handleToggleEnabled(gateway.id)}
                    disabled={!gateway.configured}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible>
                <AccordionItem value="details">
                  <AccordionTrigger className="text-sm py-2">Details & Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 py-2">
                      <p className="text-sm">{gateway.description}</p>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Supported Payment Methods</h4>
                        <div className="flex flex-wrap gap-1">
                          {gateway.supportedMethods.map((method, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="pt-2">
                        {gateway.configured ? (
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-1" /> Manage Settings
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleConfigure(gateway.id)}
                          >
                            <CreditCard className="h-3 w-3 mr-1" /> Configure
                          </Button>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
            <CardFooter className="bg-muted/40 pt-2 pb-2 px-6 flex justify-between">
              <div className="flex items-center text-xs text-muted-foreground">
                <Shield className="h-3 w-3 mr-1" /> 
                Secure payment processing
              </div>
              {gateway.enabled && (
                <div className="flex items-center text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" /> 
                  Active for guest payments
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
