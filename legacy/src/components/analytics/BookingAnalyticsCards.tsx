
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { CalendarDays, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface BookingAnalyticsData {
  totalBookings: number; 
  bookingGrowth: number;
  avgStayLength: number;
  occupancyRate: number;
  revenuePerAvailableRoom: number;
  monthlyBookingData: { month: string; bookings: number }[];
}

interface BookingAnalyticsCardsProps {
  data: BookingAnalyticsData;
}

export const BookingAnalyticsCards: React.FC<BookingAnalyticsCardsProps> = ({ data }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Bookings Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalBookings.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.bookingGrowth >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <TrendingUp className="mr-1 h-3 w-3 text-red-500 transform rotate-180" />
            )}
            <span className={data.bookingGrowth >= 0 ? "text-green-500" : "text-red-500"}>
              {data.bookingGrowth >= 0 ? "+" : ""}{data.bookingGrowth}%
            </span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* Average Stay Length Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Stay Length</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.avgStayLength} days</div>
          <p className="text-xs text-muted-foreground mt-2">
            Average length of guest stays
          </p>
        </CardContent>
      </Card>

      {/* Occupancy Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.occupancyRate}%</div>
          <div className="mt-2">
            <Progress value={data.occupancyRate} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Current hotel occupancy
          </p>
        </CardContent>
      </Card>

      {/* RevPAR Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">RevPAR</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.revenuePerAvailableRoom}</div>
          <p className="text-xs text-muted-foreground mt-2">
            Revenue Per Available Room
          </p>
        </CardContent>
      </Card>

      {/* Monthly Bookings Chart (spans full width) */}
      <Card className="col-span-1 md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Monthly Bookings</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.monthlyBookingData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="bookings" fill="#8884d8" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
