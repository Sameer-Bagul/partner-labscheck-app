'use client'
import { toast } from 'sonner';
import { cancelSubscriptionPayment, createSubscription, getCurrentSubscription } from '@/app/api/subscribe/route';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

interface Subscription {
  status: string;
  start_at?: string;
  charge_at?: string;
  paid_count: number;
  total_count: number;
  remaining_count: number;
  short_url?: string;
}


export const useCancelSubscriptionPayment = () => {
  return useMutation({
    mutationFn: cancelSubscriptionPayment,
    onSuccess: () => {
      toast.info('Payment cancelled successfully');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to cancel payment'}`);
    },
    retry: false,
  });
};

export const useCurrentSubscription = (partnerId: string, onActive?: (subscription: any) => void) => {
  const [isPolling, setIsPolling] = useState(true);

  const query = useQuery<Subscription>({
    queryKey: ["/api/subscription-status", partnerId],
    queryFn: () => getCurrentSubscription(partnerId) as Promise<Subscription>,
    enabled: !!partnerId,
    refetchInterval: isPolling ? 5000 : false, // dynamic polling toggle
    refetchOnWindowFocus: true,
    retry: false,
  });

  useEffect(() => {
    if (query.data?.status === "active") {
      setIsPolling(false); // stops polling

      // Call invoices endpoint if callback provided
      if (onActive) onActive(query.data);
    }
  }, [query.data?.status]);

  return query;
};

export const useCreateSubscription = () => {  
  return useMutation({
    mutationFn: createSubscription,
    onSuccess: () => {
      toast.success('Subscription order created successfully!');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to create subscription order'}`);
    },
    retry: false,
  });
};
