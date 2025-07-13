
import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChannelManager } from '@/components/integrations/ChannelManager';
import { PaymentGateways } from '@/components/integrations/PaymentGateways';
import { ExternalApis } from '@/components/integrations/ExternalApis';
import { EmailMarketing } from '@/components/integrations/EmailMarketing';
import { 
  Globe, CreditCard, Cloud, Mail, 
  Layers, Settings, Puzzle, Webhook
} from 'lucide-react';

export default function Integrations() {
  const [activeTab, setActiveTab] = useState('channel-manager');

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Integrations & Channels"
        description="Connect your hotel system with external services and manage multiple sales channels"
      />

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-8"
      >
        <TabsList className="bg-background border h-14 p-1 grid grid-cols-4 w-full">
          <TabsTrigger 
            value="channel-manager"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
          >
            <Globe className="h-4 w-4" />
            <span>Channel Manager</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="payment-gateways"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
          >
            <CreditCard className="h-4 w-4" />
            <span>Payment Gateways</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="external-apis"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
          >
            <Cloud className="h-4 w-4" />
            <span>External APIs</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="email-marketing"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center space-x-2"
          >
            <Mail className="h-4 w-4" />
            <span>Email Marketing</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="channel-manager" className="space-y-4">
          <ChannelManager />
        </TabsContent>
        
        <TabsContent value="payment-gateways" className="space-y-4">
          <PaymentGateways />
        </TabsContent>
        
        <TabsContent value="external-apis" className="space-y-4">
          <ExternalApis />
        </TabsContent>
        
        <TabsContent value="email-marketing" className="space-y-4">
          <EmailMarketing />
        </TabsContent>
      </Tabs>
    </div>
  );
}
