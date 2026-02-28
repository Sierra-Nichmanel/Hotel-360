
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Clock, LogIn, LogOut, Star, MessageSquare, Gift } from 'lucide-react';
import { GuestBookingForm } from './GuestBookingForm';
import { GuestCheckInForm } from './GuestCheckInForm';
import { GuestFeedbackForm } from './GuestFeedbackForm';
import { LoyaltyProgramDisplay } from './LoyaltyProgramDisplay';
import { useLanguage } from '@/lib/i18n/language-context';

export function GuestPortal() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Extract tab from URL query parameter
  const getTabFromUrl = (): string => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['booking', 'check-in-out', 'feedback', 'loyalty'].includes(tab)) {
      return tab;
    }
    return 'booking';
  };
  
  const [activeTab, setActiveTab] = useState<string>(getTabFromUrl());
  
  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    params.set('tab', activeTab);
    navigate({ search: params.toString() }, { replace: true });
  }, [activeTab, navigate, location.search]);
  
  // Update tab when URL changes
  useEffect(() => {
    setActiveTab(getTabFromUrl());
  }, [location.search]);
  
  return (
    <div className="min-h-screen bg-background py-6 flex justify-center items-center">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Guest Experience Portal</CardTitle>
          <CardDescription>
            Book your stay, check in/out, provide feedback, or view your loyalty rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="booking" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span className="hidden sm:inline">Booking</span>
              </TabsTrigger>
              <TabsTrigger value="check-in-out" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Check In/Out</span>
              </TabsTrigger>
              <TabsTrigger value="feedback" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Feedback</span>
              </TabsTrigger>
              <TabsTrigger value="loyalty" className="flex items-center gap-2">
                <Gift className="h-4 w-4" />
                <span className="hidden sm:inline">Loyalty</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="booking">
              <GuestBookingForm />
            </TabsContent>
            
            <TabsContent value="check-in-out">
              <GuestCheckInForm />
            </TabsContent>
            
            <TabsContent value="feedback">
              <GuestFeedbackForm />
            </TabsContent>
            
            <TabsContent value="loyalty">
              <LoyaltyProgramDisplay />
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end mt-8">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
