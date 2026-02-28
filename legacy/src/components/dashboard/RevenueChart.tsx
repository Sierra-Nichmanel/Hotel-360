
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Sample data - in production this would come from the database
const getRevenueData = async () => {
  // In a real application, we would fetch this data from the database
  // For now, we'll return mock data
  return [
    { date: 'Jan', revenue: 4000 },
    { date: 'Feb', revenue: 3000 },
    { date: 'Mar', revenue: 2000 },
    { date: 'Apr', revenue: 2780 },
    { date: 'May', revenue: 1890 },
    { date: 'Jun', revenue: 2390 },
    { date: 'Jul', revenue: 3490 },
    { date: 'Aug', revenue: 5000 },
    { date: 'Sep', revenue: 4500 },
    { date: 'Oct', revenue: 3800 },
    { date: 'Nov', revenue: 4300 },
    { date: 'Dec', revenue: 5200 },
  ];
};

export const RevenueChart: React.FC = () => {
  const { data: revenueData = [], isLoading } = useQuery({
    queryKey: ['revenueData'],
    queryFn: getRevenueData,
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading chart data...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`$${value}`, 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Bar dataKey="revenue" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
