
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bed, Users, TrendingUp, DollarSign } from 'lucide-react';
import { OccupancyChart } from './OccupancyChart';
import { RevenueChart } from './RevenueChart';
import { StatCard } from './StatCard';
import { db } from '@/lib/db';

export const AnalyticsDashboard: React.FC = () => {
  const { data: roomStats } = useQuery({
    queryKey: ['roomStats'],
    queryFn: async () => {
      // In a real app, we'd get this data from the API
      // For now, we'll return mock data
      return {
        totalRooms: 50,
        occupiedRooms: 35,
        occupancyRate: 70,
        occupancyTrend: 12,
      };
    },
  });

  const { data: guestStats } = useQuery({
    queryKey: ['guestStats'],
    queryFn: async () => {
      // In a real app, we'd get this data from the API
      // For now, we'll return mock data
      return {
        totalGuests: 120,
        newGuests: 22,
        guestTrend: 8,
        vipGuests: 15,
      };
    },
  });

  const { data: revenueStats } = useQuery({
    queryKey: ['revenueStats'],
    queryFn: async () => {
      // In a real app, we'd get this data from the API
      // For now, we'll return mock data
      return {
        totalRevenue: 125000,
        revenueTrend: 15,
        averageDailyRate: 189,
        revenuePerAvailableRoom: 132,
      };
    },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Occupancy Rate"
          value={`${roomStats?.occupancyRate || 0}%`}
          description={`${roomStats?.occupiedRooms || 0} of ${roomStats?.totalRooms || 0} rooms occupied`}
          icon={Bed}
          trend={{
            value: roomStats?.occupancyTrend || 0,
            label: "from last month",
            positive: true,
          }}
        />
        <StatCard
          title="Total Guests"
          value={guestStats?.totalGuests || 0}
          description={`${guestStats?.newGuests || 0} new guests this month`}
          icon={Users}
          trend={{
            value: guestStats?.guestTrend || 0,
            label: "from last month",
            positive: true,
          }}
        />
        <StatCard
          title="Average Daily Rate"
          value={`$${revenueStats?.averageDailyRate || 0}`}
          description="Per occupied room"
          icon={TrendingUp}
        />
        <StatCard
          title="Monthly Revenue"
          value={`$${(revenueStats?.totalRevenue || 0).toLocaleString()}`}
          description="Total for current month"
          icon={DollarSign}
          trend={{
            value: revenueStats?.revenueTrend || 0,
            label: "from last month",
            positive: true,
          }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <OccupancyChart />
        <RevenueChart />
      </div>
    </div>
  );
};
