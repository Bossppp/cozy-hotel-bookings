
import { useState, useEffect } from 'react';
import { mockUsers, mockHotels, mockBookings, getUserBookings, getHotelBookings, getHotelById, getUserById, getBookingById } from './mockData';
import { User, Hotel, Booking } from '@/types';

// Set this to true to use mock data instead of API calls
const USE_MOCK_DATA = true;

export const useMockData = () => {
  const isMockEnabled = USE_MOCK_DATA;

  // Mock API functions that return promises to simulate API calls
  const mockApi = {
    // Auth related mock functions
    login: async (email: string, password: string) => {
      const user = mockUsers.find(u => u.email === email);
      if (user && password === '123456') { // Simple password check for mock data
        return { success: true, token: 'mock-token', user };
      }
      throw new Error('Invalid credentials');
    },
    
    getMe: async () => {
      // Default to first user for mock data
      return mockUsers[0];
    },
    
    // Hotels related mock functions
    getHotels: async (): Promise<Hotel[]> => {
      return mockHotels;
    },
    
    getHotelById: async (id: string): Promise<Hotel> => {
      const hotel = getHotelById(id);
      if (hotel) return hotel;
      throw new Error('Hotel not found');
    },
    
    // Bookings related mock functions
    getBookings: async (): Promise<Booking[]> => {
      // Return bookings for the first user
      return getUserBookings(mockUsers[0]._id);
    },
    
    createBooking: async (bookingData: any): Promise<Booking> => {
      // Create a mock booking and return it
      const newBooking: Booking = {
        _id: `booking${Date.now()}`,
        start_date: bookingData.start_date,
        end_date: bookingData.end_date,
        hotel: typeof bookingData.hotel === 'string' 
          ? getHotelById(bookingData.hotel) || bookingData.hotel 
          : bookingData.hotel,
        user: mockUsers[0],
        createdAt: new Date().toISOString(),
      };
      
      return newBooking;
    },
    
    deleteBooking: async (id: string): Promise<void> => {
      // Just return success, no need to actually delete in mock
      return;
    }
  };
  
  return {
    isMockEnabled,
    mockApi,
    mockUsers,
    mockHotels,
    mockBookings
  };
};
