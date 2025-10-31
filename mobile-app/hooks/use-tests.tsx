import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Test, Package } from '@/types';
import { Alert } from 'react-native';

export function useTests() {
  return useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const response = await apiClient.get('/tests');
      return response.data as Test[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const response = await apiClient.get('/packages');
      return response.data as Package[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useDeleteTest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (testId: number) => {
      await apiClient.delete(`/tests/${testId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tests'] });
      Alert.alert('Success', 'Test deleted successfully.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete test.';
      Alert.alert('Error', message);
    },
  });
}

export function useDeletePackage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (packageId: number) => {
      await apiClient.delete(`/packages/${packageId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      Alert.alert('Success', 'Package deleted successfully.');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete package.';
      Alert.alert('Error', message);
    },
  });
}
