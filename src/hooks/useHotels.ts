
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useMockData } from '@/utils/useMockData';
import { Hotel, ApiResponse } from '@/types';

export const useHotels = () => {
  const { isMockEnabled, mockApi } = useMockData();
  
  const { 
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      if (isMockEnabled) {
        const hotels = await mockApi.getHotels();
        return { data: hotels } as ApiResponse<Hotel[]>;
      }
      return api.get<Hotel[]>('/hotels');
    }
  });
  
  return {
    hotels: data?.data || [],
    isLoading,
    error,
    refetch
  };
};
