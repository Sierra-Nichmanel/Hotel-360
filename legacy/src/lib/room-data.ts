
import { Room } from './db';

// Demo data for rooms
export const demoRooms: Room[] = [
  {
    id: 1,
    number: '101',
    type: 'Standard',
    floor: 1,
    capacity: 2,
    pricePerNight: 100,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    lastCleanedAt: new Date('2023-05-10'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-10')
  },
  {
    id: 2,
    number: '102',
    type: 'Standard',
    floor: 1,
    capacity: 2,
    pricePerNight: 100,
    status: 'occupied',
    amenities: ['TV', 'WiFi', 'Air Conditioning'],
    lastCleanedAt: new Date('2023-05-05'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-05')
  },
  {
    id: 3,
    number: '201',
    type: 'Deluxe',
    floor: 2,
    capacity: 2,
    pricePerNight: 150,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine'],
    lastCleanedAt: new Date('2023-05-08'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-08')
  },
  {
    id: 4,
    number: '202',
    type: 'Deluxe',
    floor: 2,
    capacity: 2,
    pricePerNight: 150,
    status: 'cleaning',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine'],
    lastCleanedAt: new Date('2023-05-01'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-01')
  },
  {
    id: 5,
    number: '301',
    type: 'Suite',
    floor: 3,
    capacity: 4,
    pricePerNight: 250,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen'],
    lastCleanedAt: new Date('2023-05-09'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-09')
  },
  {
    id: 6,
    number: '302',
    type: 'Suite',
    floor: 3,
    capacity: 4,
    pricePerNight: 250,
    status: 'maintenance',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen'],
    lastCleanedAt: new Date('2023-04-30'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-04-30')
  },
  {
    id: 7,
    number: '401',
    type: 'Presidential Suite',
    floor: 4,
    capacity: 6,
    pricePerNight: 500,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen', 'Private Pool'],
    lastCleanedAt: new Date('2023-05-11'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-11')
  },
  {
    id: 8,
    number: '501',
    type: 'Standard',
    floor: 5,
    capacity: 2,
    pricePerNight: 120,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar'],
    lastCleanedAt: new Date('2023-05-12'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-12')
  },
  {
    id: 9,
    number: '502',
    type: 'Deluxe',
    floor: 5,
    capacity: 3,
    pricePerNight: 180,
    status: 'occupied',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Balcony'],
    lastCleanedAt: new Date('2023-05-07'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-07')
  },
  {
    id: 10,
    number: '601',
    type: 'Penthouse',
    floor: 6,
    capacity: 8,
    pricePerNight: 800,
    status: 'available',
    amenities: ['TV', 'WiFi', 'Air Conditioning', 'Mini Bar', 'Coffee Machine', 'Jacuzzi', 'Kitchen', 'Private Pool', 'Terrace', 'Gym'],
    lastCleanedAt: new Date('2023-05-13'),
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-05-13')
  }
];

// Function to fetch demo rooms (simulating API call)
export async function fetchDemoRooms(): Promise<Room[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return demoRooms;
}

// Function to get available rooms
export function getAvailableRooms(rooms: Room[]): Room[] {
  return rooms.filter(room => room.status === 'available');
}

// Function to get rooms by type
export function getRoomsByType(rooms: Room[], type: string): Room[] {
  return rooms.filter(room => room.type === type);
}

// Function to get rooms by status
export function getRoomsByStatus(rooms: Room[], status: Room['status']): Room[] {
  return rooms.filter(room => room.status === status);
}

// Function to search rooms
export function searchRooms(
  rooms: Room[],
  searchTerm: string,
  filter: 'all' | 'available' | 'occupied' | 'maintenance' | 'cleaning' = 'all'
): Room[] {
  const filteredBySearch = rooms.filter(room => {
    return (
      searchTerm === '' ||
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.amenities.some(amenity => amenity.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  if (filter === 'all') {
    return filteredBySearch;
  }
  
  return filteredBySearch.filter(room => room.status === filter);
}

// Function to add a new room
export async function addNewRoom(room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Promise<Room> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Create a new room with an ID and timestamps
  const newRoom: Room = {
    ...room,
    id: demoRooms.length + 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  // Add the new room to the demo rooms array
  demoRooms.push(newRoom);
  
  return newRoom;
}
