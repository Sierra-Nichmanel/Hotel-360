
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fetchBookingData } from '@/lib/reports-data';
import { Loader2 } from 'lucide-react';

export const BookingReport: React.FC = () => {
  const { data: bookingData, isLoading } = useQuery({
    queryKey: ['bookingReport'],
    queryFn: fetchBookingData,
  });

  // Process data for multi-line chart
  const processedData = useMemo(() => {
    if (!bookingData) return [];
    
    const periods = [...new Set(bookingData.map(item => item.period))];
    
    return periods.map(period => {
      const result: any = { period };
      
      bookingData
        .filter(item => item.period === period)
        .forEach(item => {
          if (item.channel) {
            result[item.channel] = item.count;
          }
        });
      
      // Add total
      result.total = bookingData
        .filter(item => item.period === period)
        .reduce((sum, item) => sum + item.count, 0);
      
      return result;
    });
  }, [bookingData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Booking Report</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
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
              <Line type="monotone" dataKey="total" name="Total Bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="direct" name="Direct Bookings" stroke="#82ca9d" />
              <Line type="monotone" dataKey="ota" name="OTA Bookings" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};
