
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchGuestData } from '@/lib/reports-data';
import { Loader2 } from 'lucide-react';

export const GuestReport: React.FC = () => {
  const { data: guestData, isLoading } = useQuery({
    queryKey: ['guestReport'],
    queryFn: fetchGuestData,
  });

  // Process data for stacked bar chart
  const processedData = useMemo(() => {
    if (!guestData) return [];
    
    const periods = [...new Set(guestData.map(item => item.period))];
    
    return periods.map(period => {
      const result: any = { period };
      
      guestData
        .filter(item => item.period === period)
        .forEach(item => {
          if (item.type) {
            result[item.type] = item.count;
          }
        });
      
      return result;
    });
  }, [guestData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Guest Report</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={processedData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="new" stackId="a" name="New Guests" fill="#8884d8" />
              <Bar dataKey="returning" stackId="a" name="Returning Guests" fill="#82ca9d" />
              <Bar dataKey="vip" stackId="a" name="VIP Guests" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
