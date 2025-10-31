import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Subscription, Invoice } from '@/types';

export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const response = await apiClient.get('/subscription');
      return response.data as Subscription;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useInvoices() {
  return useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const response = await apiClient.get('/subscription/invoices');
      return response.data as Invoice[];
    },
    staleTime: 5 * 60 * 1000,
  });
}
