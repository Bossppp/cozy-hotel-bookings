
import { User, Hotel, Booking, Address } from "@/types";

// Mock Users
export const mockUsers: User[] = [
  {
    _id: "user1",
    name: "John Doe",
    tel: "080-123-4567",
    email: "john@example.com",
    role: "user",
    createdAt: "2023-10-15T08:00:00Z",
  },
  {
    _id: "user2",
    name: "Jane Smith",
    tel: "090-987-6543",
    email: "jane@example.com",
    role: "user",
    createdAt: "2023-11-20T10:30:00Z",
  },
  {
    _id: "admin1",
    name: "Admin User",
    tel: "099-888-7777",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2023-09-01T09:15:00Z",
  },
];

// Mock Addresses
const mockAddresses: Address[] = [
  {
    building_number: "123",
    street: "Sukhumvit Road",
    district: "Watthana",
    province: "Bangkok",
    postalcode: "10110",
  },
  {
    building_number: "456",
    street: "Silom Road",
    district: "Bang Rak",
    province: "Bangkok",
    postalcode: "10500",
  },
  {
    building_number: "789",
    street: "Pattaya Beach Road",
    district: "Bang Lamung",
    province: "Chonburi",
    postalcode: "20150",
  },
  {
    building_number: "101",
    street: "Nimman Road",
    district: "Suthep",
    province: "Chiang Mai",
    postalcode: "50200",
  },
  {
    building_number: "222",
    street: "Patong Beach Road",
    district: "Patong",
    province: "Phuket",
    postalcode: "83150",
  },
];

// Mock Hotels
export const mockHotels: Hotel[] = [
  {
    _id: "hotel1",
    name: "Bangkok Luxury Hotel",
    address: mockAddresses[0],
    tel: "02-123-4567",
  },
  {
    _id: "hotel2",
    name: "Silom Business Suite",
    address: mockAddresses[1],
    tel: "02-765-4321",
  },
  {
    _id: "hotel3",
    name: "Pattaya Beach Resort",
    address: mockAddresses[2],
    tel: "038-111-2222",
  },
  {
    _id: "hotel4",
    name: "Chiang Mai Mountain View",
    address: mockAddresses[3],
    tel: "053-222-3333",
  },
  {
    _id: "hotel5",
    name: "Phuket Paradise Hotel",
    address: mockAddresses[4],
    tel: "076-333-4444",
  },
];

// Helper function to get a date string that's a certain number of days from now
const getDateString = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    _id: "booking1",
    start_date: getDateString(5),
    end_date: getDateString(8),
    hotel: mockHotels[0],
    user: mockUsers[0],
    createdAt: getDateString(-10),
  },
  {
    _id: "booking2",
    start_date: getDateString(15),
    end_date: getDateString(17),
    hotel: mockHotels[1],
    user: mockUsers[0],
    createdAt: getDateString(-5),
  },
  {
    _id: "booking3",
    start_date: getDateString(7),
    end_date: getDateString(10),
    hotel: mockHotels[2],
    user: mockUsers[1],
    createdAt: getDateString(-15),
  },
  {
    _id: "booking4",
    start_date: getDateString(20),
    end_date: getDateString(22),
    hotel: mockHotels[3],
    user: mockUsers[1],
    createdAt: getDateString(-3),
  },
  {
    _id: "booking5",
    start_date: getDateString(1),
    end_date: getDateString(3),
    hotel: mockHotels[4],
    user: mockUsers[0],
    createdAt: getDateString(-7),
  },
  {
    _id: "booking6",
    start_date: getDateString(12),
    end_date: getDateString(14),
    hotel: mockHotels[0],
    user: mockUsers[1],
    createdAt: getDateString(-20),
  },
  {
    _id: "booking7",
    start_date: getDateString(25),
    end_date: getDateString(27),
    hotel: mockHotels[2],
    user: mockUsers[0],
    createdAt: getDateString(-1),
  },
  {
    _id: "booking8",
    start_date: getDateString(10),
    end_date: getDateString(12),
    hotel: mockHotels[4],
    user: mockUsers[1],
    createdAt: getDateString(-30),
  },
];

// Export a helper function to get bookings for a specific user
export const getUserBookings = (userId: string): Booking[] => {
  return mockBookings.filter((booking) => {
    if (typeof booking.user === 'string') {
      return booking.user === userId;
    } else {
      return booking.user._id === userId;
    }
  });
};

// Export a helper function to get bookings for a specific hotel
export const getHotelBookings = (hotelId: string): Booking[] => {
  return mockBookings.filter((booking) => {
    if (typeof booking.hotel === 'string') {
      return booking.hotel === hotelId;
    } else {
      return booking.hotel._id === hotelId;
    }
  });
};

// Export a function to get a hotel by ID
export const getHotelById = (hotelId: string): Hotel | undefined => {
  return mockHotels.find((hotel) => hotel._id === hotelId);
};

// Export a function to get a user by ID
export const getUserById = (userId: string): User | undefined => {
  return mockUsers.find((user) => user._id === userId);
};

// Export a function to get a booking by ID
export const getBookingById = (bookingId: string): Booking | undefined => {
  return mockBookings.find((booking) => booking._id === bookingId);
};
