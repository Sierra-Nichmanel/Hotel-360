
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RevenueReport } from '@/components/reports/RevenueReport';
import { OccupancyReport } from '@/components/reports/OccupancyReport';
import { GuestReport } from '@/components/reports/GuestReport';
import { BookingReport } from '@/components/reports/BookingReport';
import { RoomTypeDistribution, BookingSourceDistribution } from '@/components/reports/DistributionCharts';

export default function Reports() {
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
        <div className="flex items-center space-x-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy</TabsTrigger>
          <TabsTrigger value="guests">Guests</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="revenue" className="space-y-4">
          <RevenueReport />
        </TabsContent>
        
        <TabsContent value="occupancy" className="space-y-4">
          <OccupancyReport />
        </TabsContent>
        
        <TabsContent value="guests" className="space-y-4">
          <GuestReport />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <BookingReport />
        </TabsContent>
        
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <RoomTypeDistribution />
            <BookingSourceDistribution />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
