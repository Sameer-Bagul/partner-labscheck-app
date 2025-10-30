import {
  alllabsList,
  addNewLab,
  updateLab,
  getLabByID,
deleteLab
} from '@/app/api/labs/route';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

export const useAllLabList = () => {
  return useQuery({
    queryKey: ['alllabsList'],
    queryFn: alllabsList,
    retry: false,
    // initialData: [],
    refetchOnMount: true, // Ensures fresh data on reload
    refetchOnWindowFocus: false, // Prevents unnecessary refetches
  });
};

export const useAddLabs = () => {
  return useMutation({
    mutationFn: addNewLab,
    onSuccess: () => {
      toast.success('Laboratory successfully added!');
      // ❌ Do not set state here that triggers a re-render!
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to add laboratory'}`);
    },
    retry: false,
  });
};

export const useUpdateLabs = () => {
  return useMutation({
    mutationFn: updateLab,
    onSuccess: () => {
      toast.success('Laboratory successfully Updated!');
      // ❌ Do not set state here that triggers a re-render!
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to Update laboratory'}`);
    },
    retry: false,
  });
};

export const useGetLabById = (id: number, options = {}) => {
  return useQuery({
    queryKey: ['lab', id],
    queryFn: () => getLabByID(id),
    enabled: Boolean(id),
    ...options,
  });
};

export const useDeleteLab = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLab,
    onSuccess: () => {
      toast.success('Laboratory successfully deleted!');
      queryClient.invalidateQueries({ queryKey: ['alllabsList'] });

    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to delete laboratory'}`);
    },
    retry: false,
    ...options,
  });
};



