
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Crown, Gift, Award, Star, Coffee, Wifi, Utensils, Clock, CalendarDays, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/lib/i18n/language-context';

export function LoyaltyProgramDisplay() {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email to enroll in the loyalty program.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsEnrolled(true);
      setLoyaltyPoints(120);
      
      toast({
        title: "Enrollment Successful",
        description: "Welcome to our loyalty program! You've received 120 welcome points.",
      });
    }, 1500);
  };
  
  const checkPointsNeeded = () => {
    if (tier === 'Bronze') return 500 - loyaltyPoints;
    if (tier === 'Silver') return 1000 - loyaltyPoints;
    if (tier === 'Gold') return 2000 - loyaltyPoints;
    return 0;
  };
  
  const getTierProgress = () => {
    if (tier === 'Bronze') return (loyaltyPoints / 500) * 100;
    if (tier === 'Silver') return (loyaltyPoints / 1000) * 100;
    if (tier === 'Gold') return (loyaltyPoints / 2000) * 100;
    return 100;
  };
  
  const renderTierIcon = () => {
    if (tier === 'Bronze') return <Award className="h-10 w-10 text-amber-700" />;
    if (tier === 'Silver') return <Award className="h-10 w-10 text-gray-400" />;
    if (tier === 'Gold') return <Crown className="h-10 w-10 text-yellow-400" />;
    return <Star className="h-10 w-10 text-purple-600" />;
  };
  
  const redeemableBenefits = [
    { name: 'Free Breakfast', points: 100, icon: <Coffee className="h-5 w-5" /> },
    { name: 'Premium WiFi', points: 50, icon: <Wifi className="h-5 w-5" /> },
    { name: 'Restaurant Discount', points: 150, icon: <Utensils className="h-5 w-5" /> },
    { name: 'Late Checkout', points: 75, icon: <Clock className="h-5 w-5" /> },
    { name: 'Free Night Stay', points: 500, icon: <CalendarDays className="h-5 w-5" /> },
  ];
  
  return (
    <div className="space-y-6">
      {!isEnrolled ? (
        <Card>
          <CardHeader>
            <CardTitle>Join Our Loyalty Program</CardTitle>
            <CardDescription>
              Earn points with every stay and unlock exclusive benefits.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEnroll} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  'Enroll Now'
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <div className="text-sm text-muted-foreground">
              <ul className="list-disc pl-5 space-y-1">
                <li>Earn 10 points for every $1 spent</li>
                <li>Free room upgrades when available</li>
                <li>Early check-in and late check-out options</li>
                <li>Exclusive member-only rates</li>
              </ul>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-xl">Your Loyalty Status</CardTitle>
                <CardDescription>Member since {new Date().toLocaleDateString()}</CardDescription>
              </div>
              {renderTierIcon()}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{tier} Member</span>
                  <span className="text-lg font-semibold">{loyaltyPoints} points</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to {tier === 'Bronze' ? 'Silver' : tier === 'Silver' ? 'Gold' : 'Platinum'}</span>
                    <span>{checkPointsNeeded()} points needed</span>
                  </div>
                  <Progress value={getTierProgress()} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Benefits</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {redeemableBenefits.map((benefit, index) => (
                <Card key={index} className={loyaltyPoints >= benefit.points ? "" : "opacity-50"}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {benefit.icon}
                      </div>
                      <div>
                        <p className="font-medium">{benefit.name}</p>
                        <p className="text-sm text-muted-foreground">{benefit.points} points</p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      disabled={loyaltyPoints < benefit.points}
                    >
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
