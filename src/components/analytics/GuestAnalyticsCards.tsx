
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Users, Star, Zap, Calendar } from 'lucide-react';

interface GuestAnalyticsData {
  totalGuests: number;
  guestGrowth: number;
  vipPercentage: number;
  newGuestsLastMonth: number;
  guestsByCountry: { name: string; value: number }[];
  guestRetentionRate: number;
}

interface GuestAnalyticsCardsProps {
  data: GuestAnalyticsData;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const GuestAnalyticsCards: React.FC<GuestAnalyticsCardsProps> = ({ data }) => {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Guests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalGuests.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground flex items-center">
            {data.guestGrowth >= 0 ? (
              <Zap className="mr-1 h-3 w-3 text-green-500" />
            ) : (
              <Zap className="mr-1 h-3 w-3 text-red-500" />
            )}
            <span className={data.guestGrowth >= 0 ? "text-green-500" : "text-red-500"}>
              {data.guestGrowth >= 0 ? "+" : ""}{data.guestGrowth}%
            </span>
            <span className="ml-1">from last month</span>
          </p>
        </CardContent>
      </Card>

      {/* VIP Guests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">VIP Guests</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.vipPercentage}%</div>
          <div className="mt-2">
            <Progress value={data.vipPercentage} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Percentage of total guest base
          </p>
        </CardContent>
      </Card>

      {/* New Guests Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Guests (30d)</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.newGuestsLastMonth}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {(data.newGuestsLastMonth / data.totalGuests * 100).toFixed(1)}% of total guest base
          </p>
        </CardContent>
      </Card>

      {/* Retention Rate Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
          <Zap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.guestRetentionRate}%</div>
          <div className="mt-2">
            <Progress value={data.guestRetentionRate} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Returning guests percentage
          </p>
        </CardContent>
      </Card>

      {/* Guests by Country Card (spans 2 columns) */}
      <Card className="col-span-1 md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Guests by Country</CardTitle>
        </CardHeader>
        <CardContent className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.guestsByCountry}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.guestsByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Guests']} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};
