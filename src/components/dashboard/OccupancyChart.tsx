
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '@/lib/db';

// Sample data - in production this would come from the database
const getOccupancyData = async () => {
  // In a real application, we would fetch this data from the database
  // For now, we'll return mock data
  return [
    { date: 'Jan', occupancy: 65 },
    { date: 'Feb', occupancy: 59 },
    { date: 'Mar', occupancy: 80 },
    { date: 'Apr', occupancy: 81 },
    { date: 'May', occupancy: 56 },
    { date: 'Jun', occupancy: 55 },
    { date: 'Jul', occupancy: 60 },
    { date: 'Aug', occupancy: 70 },
    { date: 'Sep', occupancy: 65 },
    { date: 'Oct', occupancy: 75 },
    { date: 'Nov', occupancy: 90 },
    { date: 'Dec', occupancy: 95 },
  ];
};

export const OccupancyChart: React.FC = () => {
  const { data: occupancyData = [], isLoading } = useQuery({
    queryKey: ['occupancyData'],
    queryFn: getOccupancyData,
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Occupancy Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart
              data={occupancyData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis unit="%" />
              <Tooltip 
                formatter={(value: number) => [`${value}%`, 'Occupancy']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area type="monotone" dataKey="occupancy" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
