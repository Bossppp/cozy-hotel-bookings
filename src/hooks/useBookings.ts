
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useMockData } from '@/utils/useMockData';
import { Booking, BookingFormData } from '@/types';

export const useBookings = () => {
  const { isMockEnabled, mockApi } = useMockData();
  const queryClient = useQueryClient();
  
  // Get all bookings for the current user
  const { 
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
    refetch
  } = useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      if (isMockEnabled) {
        const bookings = await mockApi.getBookings();
        return { data: bookings };
      }
      return api.get<Booking[]>('/bookings');
    }
  });

  // Create a new booking
  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: BookingFormData) => {
      if (isMockEnabled) {
        return mockApi.createBooking(bookingData);
      }
      return api.post<Booking>('/bookings', bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });

  // Cancel a booking
  const cancelBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      if (isMockEnabled) {
        return mockApi.deleteBooking(bookingId);
      }
      return api.delete<{}>(`/bookings/${bookingId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    }
  });
  
  return {
    bookings: bookingsData?.data || [],
    isLoading: bookingsLoading,
    error: bookingsError,
    createBooking: createBookingMutation.mutate,
    isCreating: createBookingMutation.isPending,
    cancelBooking: cancelBookingMutation.mutate,
    isCancelling: cancelBookingMutation.isPending,
    refetch
  };
};
