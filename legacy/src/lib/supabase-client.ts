
import { supabase } from "@/integrations/supabase/client";
import { db, User } from './db';

// Types for our Supabase data
export interface SupabaseGuest {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  id_type?: string;
  id_number?: string;
  vip_status?: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseRoom {
  id: string;
  room_number: string;
  room_type: string;
  floor: number;
  capacity: number;
  price_per_night: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities: string[];
  last_cleaned_at?: string;
  next_maintenance_at?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseBooking {
  id: string;
  guest_id: string;
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  number_of_guests: number;
  total_amount: number;
  deposit_amount?: number;
  special_requests?: string;
  booking_source?: string;
  created_at: string;
  updated_at: string;
  guest?: SupabaseGuest;
  room?: SupabaseRoom;
}

export interface SupabaseStaff {
  id: string;
  email: string;
  name: string;
  department: 'management' | 'front_desk' | 'housekeeping' | 'maintenance' | 'restaurant';
  position: string;
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'maintenance';
  hire_date: string;
  salary?: number;
  emergency_contact?: string;
  emergency_phone?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTask {
  id: string;
  title: string;
  description?: string;
  assigned_to?: string;
  room_id?: string;
  due_date?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  staff?: SupabaseStaff;
  room?: SupabaseRoom;
}

export interface SupabaseInventoryItem {
  id: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  quantity: number;
  min_quantity: number;
  cost: number;
  location?: string;
  supplier?: string;
  last_restocked_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SupabaseReport {
  id: string;
  title: string;
  type: 'occupancy' | 'revenue' | 'inventory' | 'staff' | 'custom';
  parameters: any;
  last_generated?: string;
  created_by?: string;
  is_scheduled: boolean;
  schedule_frequency?: string;
  created_at: string;
  updated_at: string;
  staff?: SupabaseStaff;
}

// Interface for the auth context state
export interface AuthState {
  user: SupabaseStaff | null;
  session: any | null;
  loading: boolean;
}

// Since we don't have tables in Supabase yet, we'll modify these functions
// to return mock data or empty arrays until tables are created

// Fetch data from Supabase
export const fetchGuests = async (): Promise<SupabaseGuest[]> => {
  try {
    console.log('Fetching guests from Supabase...');
    // Return an empty array since the guests table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching guests:', error);
    return [];
  }
};

export const fetchRooms = async (): Promise<SupabaseRoom[]> => {
  try {
    console.log('Fetching rooms from Supabase...');
    // Return an empty array since the rooms table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
};

export const fetchBookings = async (): Promise<SupabaseBooking[]> => {
  try {
    console.log('Fetching bookings from Supabase...');
    // Return an empty array since the bookings table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const fetchTasks = async (): Promise<SupabaseTask[]> => {
  try {
    console.log('Fetching tasks from Supabase...');
    // Return an empty array since the tasks table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const fetchInventoryItems = async (): Promise<SupabaseInventoryItem[]> => {
  try {
    console.log('Fetching inventory items from Supabase...');
    // Return an empty array since the inventory_items table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
};

export const fetchReports = async (): Promise<SupabaseReport[]> => {
  try {
    console.log('Fetching reports from Supabase...');
    // Return an empty array since the reports table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const fetchStaff = async (): Promise<SupabaseStaff[]> => {
  try {
    console.log('Fetching staff from Supabase...');
    // Return an empty array since the staff table doesn't exist yet
    return [];
  } catch (error) {
    console.error('Error fetching staff:', error);
    return [];
  }
};

// Authentication functions
export const signInWithEmailPassword = async (email: string, password: string) => {
  try {
    // For demo purposes, we'll create a mock authentication response
    // This would normally check against a Supabase table
    
    // Demo staff data based on email
    const demoStaff: Record<string, SupabaseStaff> = {
      'hotel@example.com': {
        id: 'admin-id',
        email: 'hotel@example.com',
        name: 'Admin User',
        department: 'management',
        position: 'Administrator',
        role: 'admin',
        hire_date: '2022-01-01',
        is_active: true,
        created_at: '2022-01-01',
        updated_at: '2022-01-01'
      },
      'manager@hospitify.com': {
        id: 'manager-id',
        email: 'manager@hospitify.com',
        name: 'Manager User',
        department: 'management',
        position: 'Hotel Manager',
        role: 'manager',
        hire_date: '2022-01-02',
        is_active: true,
        created_at: '2022-01-02',
        updated_at: '2022-01-02'
      },
      'reception@hospitify.com': {
        id: 'reception-id',
        email: 'reception@hospitify.com',
        name: 'Reception User',
        department: 'front_desk',
        position: 'Receptionist',
        role: 'receptionist',
        hire_date: '2022-01-03',
        is_active: true,
        created_at: '2022-01-03',
        updated_at: '2022-01-03'
      },
      'housekeeping@hospitify.com': {
        id: 'housekeeping-id',
        email: 'housekeeping@hospitify.com',
        name: 'Housekeeping User',
        department: 'housekeeping',
        position: 'Housekeeping Staff',
        role: 'housekeeping',
        hire_date: '2022-01-04',
        is_active: true,
        created_at: '2022-01-04',
        updated_at: '2022-01-04'
      },
      'maintenance@hospitify.com': {
        id: 'maintenance-id',
        email: 'maintenance@hospitify.com',
        name: 'Maintenance User',
        department: 'maintenance',
        position: 'Maintenance Staff',
        role: 'maintenance',
        hire_date: '2022-01-05',
        is_active: true,
        created_at: '2022-01-05',
        updated_at: '2022-01-05'
      }
    };

    // Check if email exists in our demo data
    const staffMember = demoStaff[email];
    
    if (!staffMember) {
      console.error('Staff member not found or inactive');
      return { success: false, message: 'Staff member not found or inactive' };
    }

    // Check password (simple check for demo)
    if (password === 'hotel123') {
      // Store auth info in localStorage
      localStorage.setItem('hospitify_auth', JSON.stringify({
        userId: staffMember.id,
        role: staffMember.role,
        timestamp: new Date().getTime()
      }));

      // For demo, we'll just update the last login time in memory
      staffMember.last_login = new Date().toISOString();

      return { 
        success: true, 
        user: staffMember 
      };
    } else {
      return { success: false, message: 'Invalid password' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'An unexpected error occurred' };
  }
};

export const checkAuthentication = async () => {
  try {
    const authData = localStorage.getItem('hospitify_auth');
      
    if (!authData) {
      return { success: false };
    }
      
    const { userId, role, timestamp } = JSON.parse(authData);
      
    // Check if session is expired (24 hours)
    const now = new Date().getTime();
    const expirationTime = 24 * 60 * 60 * 1000; // 24 hours
      
    if (now - timestamp > expirationTime) {
      localStorage.removeItem('hospitify_auth');
      return { success: false };
    }
      
    // For demo, return a mock staff member based on role
    const demoStaff: Record<string, SupabaseStaff> = {
      'admin': {
        id: 'admin-id',
        email: 'admin@hospitify.com',
        name: 'Admin User',
        department: 'management',
        position: 'Administrator',
        role: 'admin',
        hire_date: '2022-01-01',
        is_active: true,
        created_at: '2022-01-01',
        updated_at: '2022-01-01'
      },
      'manager': {
        id: 'manager-id',
        email: 'manager@hospitify.com',
        name: 'Manager User',
        department: 'management',
        position: 'Hotel Manager',
        role: 'manager',
        hire_date: '2022-01-02',
        is_active: true,
        created_at: '2022-01-02',
        updated_at: '2022-01-02'
      },
      'receptionist': {
        id: 'reception-id',
        email: 'reception@hospitify.com',
        name: 'Reception User',
        department: 'front_desk',
        position: 'Receptionist',
        role: 'receptionist',
        hire_date: '2022-01-03',
        is_active: true,
        created_at: '2022-01-03',
        updated_at: '2022-01-03'
      },
      'housekeeping': {
        id: 'housekeeping-id',
        email: 'housekeeping@hospitify.com',
        name: 'Housekeeping User',
        department: 'housekeeping',
        position: 'Housekeeping Staff',
        role: 'housekeeping',
        hire_date: '2022-01-04',
        is_active: true,
        created_at: '2022-01-04',
        updated_at: '2022-01-04'
      },
      'maintenance': {
        id: 'maintenance-id',
        email: 'maintenance@hospitify.com',
        name: 'Maintenance User',
        department: 'maintenance',
        position: 'Maintenance Staff',
        role: 'maintenance',
        hire_date: '2022-01-05',
        is_active: true,
        created_at: '2022-01-05',
        updated_at: '2022-01-05'
      }
    };
      
    // Find staff member based on role
    const staffMember = demoStaff[role];
    
    if (!staffMember) {
      localStorage.removeItem('hospitify_auth');
      return { success: false };
    }
      
    return { success: true, user: staffMember };
  } catch (error) {
    console.error('Authentication check error:', error);
    return { success: false };
  }
};

export const logout = () => {
  localStorage.removeItem('hospitify_auth');
};
