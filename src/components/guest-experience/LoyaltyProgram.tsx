
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Award, Gift, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface LoyaltyProgramProps {
  guestId?: string;
}

export function LoyaltyProgram({ guestId }: LoyaltyProgramProps) {
  const [points, setPoints] = useState(0);
  const [tier, setTier] = useState("Bronze");
  const [nextTier, setNextTier] = useState("Silver");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState([
    { id: 1, name: "Free Breakfast", cost: 100, available: true },
    { id: 2, name: "Late Checkout", cost: 200, available: true },
    { id: 3, name: "Room Upgrade", cost: 500, available: true },
    { id: 4, name: "Spa Voucher", cost: 700, available: true },
  ]);

  // Simulate fetching guest loyalty data
  useEffect(() => {
    const fetchLoyaltyData = async () => {
      if (!guestId) {
        setLoading(false);
        return;
      }
      
      try {
        // In a real implementation, this would fetch from Supabase
        // const { data, error } = await supabase
        //   .from('guest_loyalty')
        //   .select('*')
        //   .eq('guest_id', guestId)
        //   .single();
        
        // Simulate data for demo
        const mockData = {
          points: 350,
          tier: "Silver",
          next_tier: "Gold",
          progress: 35
        };
        
        setPoints(mockData.points);
        setTier(mockData.tier);
        setNextTier(mockData.next_tier);
        setProgress(mockData.progress);
      } catch (error) {
        console.error("Error fetching loyalty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, [guestId]);

  const redeemReward = (rewardId: number) => {
    // In a real implementation, this would update the database
    setRewards(rewards.map(reward => 
      reward.id === rewardId ? { ...reward, available: false } : reward
    ));
    
    // Deduct points
    const rewardCost = rewards.find(r => r.id === rewardId)?.cost || 0;
    setPoints(prev => prev - rewardCost);
    
    // Show success message
    alert(`Reward redeemed successfully! ${rewardCost} points have been deducted.`);
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading loyalty program...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Loyalty Program</CardTitle>
            <Badge variant="outline" className="text-lg px-3 py-1 bg-primary/10">
              {tier} Member
            </Badge>
          </div>
          <CardDescription>
            Earn points with every stay and redeem them for exclusive rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-lg font-medium">{points} Points</span>
            <span className="text-sm text-muted-foreground">Next tier: {nextTier}</span>
          </div>
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="grid gap-4 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
              <Award className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Member Benefits</h3>
                <p className="text-sm text-muted-foreground">
                  {tier === "Bronze" && "10% discount on food and beverages"}
                  {tier === "Silver" && "15% discount on all hotel services"}
                  {tier === "Gold" && "Priority check-in and late checkout"}
                  {tier === "Platinum" && "Complementary room upgrades when available"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Earning Points</h3>
                <p className="text-sm text-muted-foreground">
                  Earn 10 points for every $1 spent on accommodations
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Rewards</CardTitle>
          <CardDescription>Redeem your points for these exclusive benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            {rewards
              .filter(reward => reward.available && reward.cost <= points)
              .map(reward => (
                <Card key={reward.id} className="relative overflow-hidden border-2 hover:border-primary">
                  <CardHeader className="pb-2">
                    <Badge className="w-fit absolute top-2 right-2">{reward.cost} Points</Badge>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      onClick={() => redeemReward(reward.id)}
                      className="w-full mt-2"
                      variant="default"
                    >
                      <Gift className="mr-2 h-4 w-4" /> Redeem Reward
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
            {rewards
              .filter(reward => reward.available && reward.cost > points)
              .map(reward => (
                <Card key={reward.id} className="relative overflow-hidden border border-muted opacity-75">
                  <CardHeader className="pb-2">
                    <Badge variant="outline" className="w-fit absolute top-2 right-2">
                      {reward.cost} Points
                    </Badge>
                    <CardTitle className="text-lg">{reward.name}</CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Button 
                      disabled
                      className="w-full mt-2"
                      variant="outline"
                    >
                      <Gift className="mr-2 h-4 w-4" /> 
                      Need {reward.cost - points} more points
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
