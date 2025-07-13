import Dexie, { Table } from 'dexie';

// Define interfaces for our models
export interface User {
  id?: number;
  username: string;
  password: string; // In a real app, you'd use a proper auth system
  name: string;
  role: 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'maintenance';
  email?: string;
  phone?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Guest {
  id?: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  idType?: string;
  idNumber?: string;
  vipStatus?: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Room {
  id?: number;
  number: string;
  type: string;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  amenities: string[];
  lastCleanedAt?: Date;
  nextMaintenanceAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Booking {
  id?: number;
  guestId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
  status: 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
  numberOfGuests: number;
  totalAmount: number;
  depositAmount?: number;
  specialRequests?: string;
  bookingSource?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id?: number;
  bookingId: number;
  amount: number;
  paymentMethod: 'cash' | 'credit_card' | 'debit_card' | 'bank_transfer' | 'online';
  paymentDate: Date;
  status: 'pending' | 'completed' | 'refunded' | 'failed';
  transactionId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Invoice {
  id?: number;
  bookingId: number;
  invoiceNumber: string;
  issueDate: Date;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  totalAmount: number;
  taxAmount: number;
  items: InvoiceItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id?: number;
  invoiceId?: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  date: Date;
}

export interface Staff {
  id?: number;
  userId: number;
  department: 'management' | 'front_desk' | 'housekeeping' | 'maintenance' | 'restaurant';
  position: string;
  hireDate: Date;
  salary: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Shift {
  id?: number;
  staffId: number;
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'absent';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  assignedToId?: number;
  roomId?: number;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryItem {
  id?: number;
  name: string;
  category: string;
  description?: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  location?: string;
  supplier?: string;
  lastRestockedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLog {
  id?: number;
  itemId: number;
  quantity: number;
  type: 'in' | 'out';
  reason: string;
  performedBy: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SyncLog {
  id?: number;
  entityName: string;
  entityId: number;
  action: 'create' | 'update' | 'delete';
  timestamp: Date;
  synced: boolean;
  syncedAt?: Date;
}

// Create database class
class HotelDatabase extends Dexie {
  users!: Table<User, number>;
  guests!: Table<Guest, number>;
  rooms!: Table<Room, number>;
  bookings!: Table<Booking, number>;
  payments!: Table<Payment, number>;
  invoices!: Table<Invoice, number>;
  invoiceItems!: Table<InvoiceItem, number>;
  staff!: Table<Staff, number>;
  shifts!: Table<Shift, number>;
  tasks!: Table<Task, number>;
  inventoryItems!: Table<InventoryItem, number>;
  inventoryLogs!: Table<InventoryLog, number>;
  syncLogs!: Table<SyncLog, number>;

  constructor() {
    super('HospitifyDB');
    
    this.version(1).stores({
      users: '++id, username, role, isActive',
      guests: '++id, lastName, firstName, phone, email',
      rooms: '++id, number, floor, type, status',
      bookings: '++id, guestId, roomId, checkInDate, checkOutDate, status',
      payments: '++id, bookingId, paymentMethod, status',
      invoices: '++id, bookingId, invoiceNumber, status',
      invoiceItems: '++id, invoiceId',
      staff: '++id, userId, department, position, isActive',
      shifts: '++id, staffId, startTime, endTime, status',
      tasks: '++id, assignedToId, roomId, dueDate, priority, status',
      inventoryItems: '++id, name, category, quantity',
      inventoryLogs: '++id, itemId, type, date',
      syncLogs: '++id, entityName, entityId, action, synced'
    });
  }

  // Helper method to add sync log entry
  async addSyncLog(
    entityName: string, 
    entityId: number, 
    action: 'create' | 'update' | 'delete'
  ) {
    await this.syncLogs.add({
      entityName,
      entityId,
      action,
      timestamp: new Date(),
      synced: false
    });
  }
}

export const db = new HotelDatabase();

// Seed initial data for demo purposes
export async function seedDatabase() {
  const count = await db.users.count();
  
  if (count > 0) {
    console.log('Database already seeded');
    return;
  }
  
  console.log('Seeding database with initial data...');
  
  // Create admin user with hashed password
  const adminId = await db.users.add({
    username: 'admin',
    password: 'admin123', // Note: will be hashed on first login
    name: 'Admin User',
    role: 'admin',
    email: 'admin@hospitify.com',
    lastLoginAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Create manager
  const managerId = await db.users.add({
    username: 'manager',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    email: 'manager@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Create receptionist
  const receptionistId = await db.users.add({
    username: 'reception',
    password: 'reception123',
    name: 'Reception User',
    role: 'receptionist',
    email: 'reception@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Create housekeeping
  const housekeepingId = await db.users.add({
    username: 'housekeeping',
    password: 'housekeeping123',
    name: 'Housekeeping User',
    role: 'housekeeping',
    email: 'housekeeping@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Create maintenance staff
  const maintenanceId = await db.users.add({
    username: 'maintenance',
    password: 'maintenance123',
    name: 'Maintenance User',
    role: 'maintenance',
    email: 'maintenance@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Add second admin for testing
  const admin2Id = await db.users.add({
    username: 'admin2',
    password: 'admin123',
    name: 'Secondary Admin',
    role: 'admin',
    email: 'admin2@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Add second manager for testing
  const manager2Id = await db.users.add({
    username: 'manager2',
    password: 'manager123',
    name: 'Assistant Manager',
    role: 'manager',
    email: 'manager2@hospitify.com',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  });
  
  // Add staff
  await db.staff.bulkAdd([
    {
      userId: adminId,
      department: 'management',
      position: 'Hotel Manager',
      hireDate: new Date('2020-01-15'),
      salary: 85000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: managerId,
      department: 'management',
      position: 'Assistant Manager',
      hireDate: new Date('2021-03-10'),
      salary: 65000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: receptionistId,
      department: 'front_desk',
      position: 'Receptionist',
      hireDate: new Date('2022-06-05'),
      salary: 45000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: housekeepingId,
      department: 'housekeeping',
      position: 'Housekeeping Supervisor',
      hireDate: new Date('2021-08-20'),
      salary: 42000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: maintenanceId,
      department: 'maintenance',
      position: 'Maintenance Technician',
      hireDate: new Date('2021-09-15'),
      salary: 47000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: admin2Id,
      department: 'management',
      position: 'General Manager',
      hireDate: new Date('2019-05-10'),
      salary: 90000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      userId: manager2Id,
      department: 'management',
      position: 'Operations Manager',
      hireDate: new Date('2020-07-15'),
      salary: 70000,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  // Add rooms
  const roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential Suite'];
  const roomsToAdd = [];
  
  for (let floor = 1; floor <= 5; floor++) {
    for (let room = 1; room <= 10; room++) {
      const roomNumber = `${floor}${room.toString().padStart(2, '0')}`;
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      
      let price, capacity, amenities;
      switch (roomType) {
        case 'Standard':
          price = 100;
          capacity = 2;
          amenities = ['TV', 'WiFi', 'Air Conditioning'];
          break;
        case 'Deluxe':
          price = 150;
          capacity = 2;
          amenities = ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine'];
          break;
        case 'Suite':
          price = 250;
          capacity = 4;
          amenities = ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen'];
          break;
        default:
          price = 500;
          capacity = 6;
          amenities = ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen', 'Private Pool'];
      }
      
      roomsToAdd.push({
        number: roomNumber,
        type: roomType,
        floor,
        capacity,
        pricePerNight: price,
        status: 'available',
        amenities,
        lastCleanedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
  
  await db.rooms.bulkAdd(roomsToAdd);
  
  // Add some guests
  await db.guests.bulkAdd([
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '555-123-4567',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
      idType: 'Passport',
      idNumber: 'US123456',
      vipStatus: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Emily',
      lastName: 'Johnson',
      email: 'emily.johnson@example.com',
      phone: '555-234-5678',
      address: '456 Elm St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      country: 'USA',
      idType: 'Driver License',
      idNumber: 'CA987654',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Michael',
      lastName: 'Lee',
      email: 'michael.lee@example.com',
      phone: '555-345-6789',
      address: '789 Oak St',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'USA',
      idType: 'Passport',
      idNumber: 'US654321',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  // Add inventory items
  await db.inventoryItems.bulkAdd([
    {
      name: 'Bath Towel',
      category: 'Linens',
      description: 'Standard bath towel',
      unit: 'Each',
      quantity: 500,
      minQuantity: 100,
      cost: 5.99,
      location: 'Main Storage',
      supplier: 'Linen Suppliers Inc.',
      lastRestockedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Toilet Paper',
      category: 'Toiletries',
      description: 'Premium toilet paper rolls',
      unit: 'Roll',
      quantity: 1000,
      minQuantity: 200,
      cost: 0.75,
      location: 'Main Storage',
      supplier: 'Cleaning Supplies Co.',
      lastRestockedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Shampoo',
      category: 'Toiletries',
      description: 'Single-use shampoo bottles',
      unit: 'Bottle',
      quantity: 800,
      minQuantity: 150,
      cost: 0.50,
      location: 'Main Storage',
      supplier: 'Amenities Plus',
      lastRestockedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  // Add tasks
  await db.tasks.bulkAdd([
    {
      title: 'Deep clean room 301',
      description: 'Perform a deep cleaning of room 301 after checkout',
      assignedToId: housekeepingId,
      roomId: 1,
      dueDate: new Date(Date.now() + 3600000),
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Fix AC in room 205',
      description: 'Air conditioning is not working properly',
      priority: 'medium',
      status: 'pending',
      roomId: 15,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Restock minibar in all suites',
      description: 'Restock all minibars in suite rooms',
      assignedToId: housekeepingId,
      priority: 'low',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  
  console.log('Database seeded successfully');
}

// Function to sync data with the cloud when online
export async function syncWithCloud() {
  // This would be implemented with a real backend API
  // Using 0/1 for the database query since IndexedDB doesn't support boolean in where clauses
  const pendingSyncs = await db.syncLogs.where('synced').equals(0).toArray();
  
  console.log(`Syncing ${pendingSyncs.length} records with cloud...`);
  
  // In a real implementation, we would send all pending changes to the server
  // and update the syncLogs
  
  // For demo purposes, just mark everything as synced
  // Use 0/1 for IndexedDB compatibility when querying, but maintain boolean type in the interface
  await Promise.all(
    pendingSyncs.map(sync => 
      db.syncLogs.update(sync.id!, { 
        synced: true, // This is a boolean in the interface
        syncedAt: new Date() 
      })
    )
  );
  
  console.log('Sync completed');
  return pendingSyncs.length;
}
