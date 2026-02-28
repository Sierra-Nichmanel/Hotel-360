import { Guest } from './db';

// Demo data for guests
export const demoGuests: Guest[] = [
  {
    id: 1,
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
    notes: 'Prefers rooms with a view. Allergic to feathers.',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20')
  },
  {
    id: 2,
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
    vipStatus: false,
    notes: 'Repeated guest. Prefers quiet rooms.',
    createdAt: new Date('2023-02-10'),
    updatedAt: new Date('2023-05-15')
  },
  {
    id: 3,
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
    vipStatus: false,
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-04-12')
  },
  {
    id: 4,
    firstName: 'Sophia',
    lastName: 'Garcia',
    email: 'sophia.garcia@example.com',
    phone: '555-456-7890',
    address: '101 Pine St',
    city: 'Miami',
    state: 'FL',
    zipCode: '33101',
    country: 'USA',
    idType: 'National ID',
    idNumber: 'US789012',
    vipStatus: true,
    notes: 'Corporate account with special rates. Prefers high floor.',
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-07-05')
  },
  {
    id: 5,
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '555-567-8901',
    address: '222 Cedar St',
    city: 'Seattle',
    state: 'WA',
    zipCode: '98101',
    country: 'USA',
    idType: 'Driver License',
    idNumber: 'WA345678',
    vipStatus: false,
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-06-01')
  },
  {
    id: 6,
    firstName: 'Emma',
    lastName: 'Martinez',
    email: 'emma.martinez@example.com',
    phone: '555-678-9012',
    address: '333 Maple St',
    city: 'Boston',
    state: 'MA',
    zipCode: '02101',
    country: 'USA',
    idType: 'Passport',
    idNumber: 'US890123',
    vipStatus: false,
    notes: 'First-time guest.',
    createdAt: new Date('2023-05-10'),
    updatedAt: new Date('2023-06-15')
  },
  {
    id: 7,
    firstName: 'James',
    lastName: 'Brown',
    email: 'james.brown@example.com',
    phone: '555-789-0123',
    address: '444 Birch St',
    city: 'Denver',
    state: 'CO',
    zipCode: '80201',
    country: 'USA',
    idType: 'Driver License',
    idNumber: 'CO901234',
    vipStatus: true,
    notes: 'VIP guest, requires special attention. Always books the presidential suite.',
    createdAt: new Date('2022-12-01'),
    updatedAt: new Date('2023-07-10')
  },
  {
    id: 8,
    firstName: 'Olivia',
    lastName: 'Davis',
    email: 'olivia.davis@example.com',
    phone: '555-890-1234',
    address: '555 Walnut St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94101',
    country: 'USA',
    idType: 'Passport',
    idNumber: 'US012345',
    vipStatus: false,
    createdAt: new Date('2023-03-20'),
    updatedAt: new Date('2023-05-05')
  },
  {
    id: 9,
    firstName: 'William',
    lastName: 'Rodriguez',
    email: 'william.rodriguez@example.com',
    phone: '555-901-2345',
    address: '666 Spruce St',
    city: 'Austin',
    state: 'TX',
    zipCode: '73301',
    country: 'USA',
    idType: 'National ID',
    idNumber: 'US123789',
    vipStatus: false,
    notes: 'Business traveler, frequent stays.',
    createdAt: new Date('2023-02-25'),
    updatedAt: new Date('2023-06-30')
  },
  {
    id: 10,
    firstName: 'Ava',
    lastName: 'Miller',
    email: 'ava.miller@example.com',
    phone: '555-012-3456',
    address: '777 Redwood St',
    city: 'Portland',
    state: 'OR',
    zipCode: '97201',
    country: 'USA',
    idType: 'Driver License',
    idNumber: 'OR234567',
    vipStatus: true,
    notes: 'Celebrity guest, requires privacy.',
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-07-15')
  }
];

// Function to fetch demo guests (simulating API call)
export async function fetchDemoGuests(): Promise<Guest[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return demoGuests;
}

// Function to get recent guests
export function getRecentGuests(guests: Guest[], count = 5): Guest[] {
  return [...guests]
    .sort((a, b) => {
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    })
    .slice(0, count);
}

// Function to get VIP guests
export function getVIPGuests(guests: Guest[]): Guest[] {
  return guests.filter(guest => guest.vipStatus);
}

// Function to search guests
export function searchGuests(
  guests: Guest[],
  searchTerm: string,
  filter: 'all' | 'vip' = 'all'
): Guest[] {
  const filteredBySearch = guests.filter(guest => {
    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase();
    const email = guest.email?.toLowerCase() || '';
    const phone = guest.phone || '';
    
    return (
      searchTerm === '' ||
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm)
    );
  });
  
  if (filter === 'vip') {
    return filteredBySearch.filter(guest => guest.vipStatus);
  }
  
  return filteredBySearch;
}

// Function to add a new guest
export async function addNewGuest(guest: Omit<Guest, 'id' | 'createdAt' | 'updatedAt'>): Promise<Guest> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create a new guest with an ID and timestamps
  const newGuest: Guest = {
    ...guest,
    id: demoGuests.length + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add the new guest to the demo guests array
  demoGuests.push(newGuest);
  
  return newGuest;
}
