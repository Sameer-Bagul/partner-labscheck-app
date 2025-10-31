import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Booking } from '@/types';

export function useBookings() {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: async () => {
      const response = await apiClient.get('/bookings');
      return response.data as Booking[];
    },
    staleTime: 1 * 60 * 1000,
  });
}

export function useBookingDetails(bookingId: number) {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      return response.data as Booking;
    },
    enabled: !!bookingId,
  });
}
