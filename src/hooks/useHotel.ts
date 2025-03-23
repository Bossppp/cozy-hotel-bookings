
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useMockData } from '@/utils/useMockData';
import { Hotel } from '@/types';

export const useHotel = (id?: string) => {
  const { isMockEnabled, mockApi } = useMockData();
  
  const { 
    data: hotelData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['hotel', id],
    queryFn: async () => {
      if (!id) throw new Error('No hotel ID provided');
      
      if (isMockEnabled) {
        const hotel = await mockApi.getHotelById(id);
        return { data: hotel };
      }
      return api.get<Hotel>(`/hotels/${id}`);
    },
    enabled: !!id
  });
  
  return {
    hotel: hotelData?.data,
    isLoading,
    error
  };
};
