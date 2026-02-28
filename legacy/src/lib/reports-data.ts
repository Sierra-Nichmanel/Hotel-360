
import { db } from '@/lib/db';

// These are demo functions that would typically fetch data from a real database
// For now, they return mock data

export type RevenueData = {
  period: string;
  amount: number;
  source?: string;
};

export type OccupancyData = {
  period: string;
  rate: number;
  roomType?: string;
};

export type GuestData = {
  period: string;
  count: number;
  type?: 'new' | 'returning' | 'vip';
};

export type BookingData = {
  period: string;
  count: number;
  channel?: string;
};

export const fetchRevenueData = async (): Promise<RevenueData[]> => {
  // In a real app, this would query the database
  return [
    { period: "Jan", amount: 12000 },
    { period: "Feb", amount: 15000 },
    { period: "Mar", amount: 18000 },
    { period: "Apr", amount: 22000 },
    { period: "May", amount: 25000 },
    { period: "Jun", amount: 32000 },
  ];
};

export const fetchOccupancyData = async (): Promise<OccupancyData[]> => {
  // In a real app, this would query the database
  return [
    { period: "Jan", rate: 65 },
    { period: "Feb", rate: 70 },
    { period: "Mar", rate: 75 },
    { period: "Apr", rate: 80 },
    { period: "May", rate: 85 },
    { period: "Jun", rate: 90 },
  ];
};

export const fetchGuestData = async (): Promise<GuestData[]> => {
  // In a real app, this would query the database
  return [
    { period: "Jan", count: 120, type: 'new' },
    { period: "Feb", count: 140, type: 'new' },
    { period: "Mar", count: 160, type: 'new' },
    { period: "Apr", count: 180, type: 'new' },
    { period: "May", count: 200, type: 'new' },
    { period: "Jun", count: 220, type: 'new' },
    { period: "Jan", count: 80, type: 'returning' },
    { period: "Feb", count: 90, type: 'returning' },
    { period: "Mar", count: 100, type: 'returning' },
    { period: "Apr", count: 110, type: 'returning' },
    { period: "May", count: 120, type: 'returning' },
    { period: "Jun", count: 130, type: 'returning' },
    { period: "Jan", count: 20, type: 'vip' },
    { period: "Feb", count: 25, type: 'vip' },
    { period: "Mar", count: 30, type: 'vip' },
    { period: "Apr", count: 35, type: 'vip' },
    { period: "May", count: 40, type: 'vip' },
    { period: "Jun", count: 45, type: 'vip' },
  ];
};

export const fetchBookingData = async (): Promise<BookingData[]> => {
  // In a real app, this would query the database
  return [
    { period: "Jan", count: 150, channel: 'direct' },
    { period: "Feb", count: 160, channel: 'direct' },
    { period: "Mar", count: 170, channel: 'direct' },
    { period: "Apr", count: 180, channel: 'direct' },
    { period: "May", count: 190, channel: 'direct' },
    { period: "Jun", count: 200, channel: 'direct' },
    { period: "Jan", count: 100, channel: 'ota' },
    { period: "Feb", count: 110, channel: 'ota' },
    { period: "Mar", count: 120, channel: 'ota' },
    { period: "Apr", count: 130, channel: 'ota' },
    { period: "May", count: 140, channel: 'ota' },
    { period: "Jun", count: 150, channel: 'ota' },
  ];
};

export const fetchRoomTypeDistribution = async (): Promise<{name: string, value: number}[]> => {
  // In a real app, this would query the database
  return [
    { name: 'Standard', value: 40 },
    { name: 'Deluxe', value: 30 },
    { name: 'Suite', value: 20 },
    { name: 'Executive', value: 10 },
  ];
};

export const fetchBookingSourceDistribution = async (): Promise<{name: string, value: number}[]> => {
  // In a real app, this would query the database
  return [
    { name: 'Direct', value: 45 },
    { name: 'Booking.com', value: 25 },
    { name: 'Expedia', value: 20 },
    { name: 'Other OTAs', value: 10 },
  ];
};
