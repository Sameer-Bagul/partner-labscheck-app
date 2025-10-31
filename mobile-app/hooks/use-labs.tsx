import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Lab } from '@/types';
import { Alert } from 'react-native';

export function useLabs() {
  return useQuery({
    queryKey: ['labs'],
    queryFn: async () => {
      const response = await apiClient.get('/labs');
      return response.data as Lab[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useLabDetails(labId: string) {
  return useQuery({
    queryKey: ['lab', labId],
    queryFn: async () => {
      const response = await apiClient.get(`/labs/${labId}`);
      return response.data as Lab;
    },
    enabled: !!labId,
  });
}

export function useDeleteLab() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (labId: string) => {
      await apiClient.delete(`/labs/${labId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['labs'] });
      Alert.alert('Success', 'Laboratory deleted successfully.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete laboratory.';
      Alert.alert('Error', message);
    },
  });
}
