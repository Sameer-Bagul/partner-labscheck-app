import { toast } from 'sonner';
import { addNewPackage,  updatePackage } from '@/app/api/packages/route';

import { useMutation, useQuery } from '@tanstack/react-query';

export const useAddPackage = () => {
    return useMutation({
      mutationFn: addNewPackage,
      onSuccess: () => {
        toast.success('Laboratory successfully added!');
        // ❌ Do not set state here that triggers a re-render!
      },
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error(`Error: ${error.message || 'Failed to add Package'}`);
      },
      retry: false,
    });
  };

  export const useUpdatePackage = () => {
    return useMutation({
      mutationFn: updatePackage,
      onSuccess: () => {
        toast.success('Package successfully updated!');
      },
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error(`Error: ${error.message || 'Failed to update Package'}`);
      },
      retry: false,
    });
  };
  
  