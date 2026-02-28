
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogIn, LogOut, Loader2, CheckCircle, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/i18n/language-context';

export function GuestCheckInForm() {
  const [mode, setMode] = useState<'check-in' | 'check-out'>('check-in');
  const [bookingRef, setBookingRef] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingRef || !lastName) {
      toast({
        title: "Missing information",
        description: "Please enter your booking reference and last name.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setSuccess(true);
      
      toast({
        title: mode === 'check-in' ? "Check-in Successful" : "Check-out Successful",
        description: mode === 'check-in' 
          ? "Welcome! You have been checked in." 
          : "Thank you for your stay. You have been checked out.",
        variant: "default"
      });
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        setBookingRef('');
        setLastName('');
      }, 2000);
    }, 1500);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-center space-x-4">
        <Button
          type="button"
          variant={mode === 'check-in' ? 'default' : 'outline'}
          onClick={() => setMode('check-in')}
          className="flex-1 sm:flex-none"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Check-in
        </Button>
        <Button
          type="button"
          variant={mode === 'check-out' ? 'default' : 'outline'}
          onClick={() => setMode('check-out')}
          className="flex-1 sm:flex-none"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Check-out
        </Button>
      </div>
      
      <Card>
        <CardContent className="pt-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-xl font-semibold">
                {mode === 'check-in' ? 'Check-in Successful!' : 'Check-out Successful!'}
              </h3>
              <p className="text-muted-foreground text-center">
                {mode === 'check-in' 
                  ? 'Welcome to our hotel. Your room is ready.'
                  : 'Thank you for your stay. We hope to see you again soon!'
                }
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="bookingRef">Booking Reference</Label>
                <Input
                  id="bookingRef"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="Enter your booking reference"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Enter your last name"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {mode === 'check-in' ? 'Check-in' : 'Check-out'}
                  </>
                )}
              </Button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground mb-2">or use QR code</p>
                <Button variant="outline" className="w-full">
                  <QrCode className="mr-2 h-4 w-4" />
                  Scan QR Code
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
