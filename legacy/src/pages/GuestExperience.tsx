
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { LoyaltyProgram } from "@/components/guest-experience/LoyaltyProgram";
import { GuestFeedback } from "@/components/guest-experience/GuestFeedback";
import { GuestBooking } from "@/components/guest-experience/GuestBooking";

export default function GuestExperience() {
  const [activeTab, setActiveTab] = useState("booking");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest Experience Portal"
        description="Manage the guest experience from booking to feedback"
      />
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty Program</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="booking" className="pt-6">
          <GuestBooking />
        </TabsContent>
        
        <TabsContent value="loyalty" className="pt-6">
          <LoyaltyProgram />
        </TabsContent>
        
        <TabsContent value="feedback" className="pt-6">
          <GuestFeedback />
        </TabsContent>
      </Tabs>
    </div>
  );
}
