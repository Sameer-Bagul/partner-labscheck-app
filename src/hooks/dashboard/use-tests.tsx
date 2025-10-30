import {
  getallTestsList,
  AddNewTests,
  getUserAddedTest,
  DeleteTests,
  UpdateTests,
  getAllParameters,
  fetchCommonTests,
  getBasicTests,
  addTest,
  deleteOfferings,
} from '@/app/api/tests/route';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';


import { toast } from 'sonner';

interface QueryParams {
  search?: string;
  offering_id?: number;
  name?:string;
  limit?:number;
  page?: number;
  pageSize ?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  offering_type?: string;
}

export const useGetAllTestList = ({
  name = '',
  page = 1,
  pageSize  = 20,
  sortBy = 'name',
  sortOrder = 'asc',
  offering_type,
  offering_id,
  
}: QueryParams) => {
  return useQuery({
    queryKey: ['allTestsList', name, page, pageSize , sortBy, sortOrder, offering_type, offering_id],
    queryFn: async () => {
      const response = await getallTestsList({
        name,
        page,
        pageSize ,
        sortBy,
        sortOrder,
        offering_type,
        offering_id, // <-- Pass offering_id to the API call
      });
      return response;
    },
    select:(data)=>({
      total:data.total,
      page:data.page,
      pageSize:data.page_size,
      offerings:data.offerings
    }),
      // ✅ smooth pagination
    retry: false,
    placeholderData: (prev) => prev ?? { total: 0, offerings: [] },
  });
};

export const useGetUserAddedTests = ({
  search = '',
  page = 1,
  limit = 10,
  sortBy = 'name',
  sortOrder = 'asc',
}: QueryParams) => {
  return useQuery({
    queryKey: ['getUserAddedTests', search, page, limit, sortBy, sortOrder],
    queryFn:  async () => {
      const response = await getUserAddedTest({
        search,
        page,
        limit,
        sortBy,
        sortOrder,
      });
      return response;
    //  Ensure function execution
    // () => {
    //   return test_profile_data
    // },
    },
    retry: false,
    placeholderData: (previousData) => previousData ?? [],
    select: (data) => data, // Ensure it's returning formatted data
    enabled: !!page,
  });
};

export const useAddNewTests = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTest,
    onSuccess: () => {
      // toast.success('Test successfully added!');
      // queryClient.invalidateQueries({ queryKey: ['getUserAddedTests'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to add test'}`);
    },
    retry: false,
  });
};

export const useDeleteTests = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { testId: number; labIds: string[] }>({
    mutationFn: DeleteTests, // ✅ Mutation function matches the expected parameters
    onSuccess: () => {
      toast.success('Test successfully deleted!');
      queryClient.invalidateQueries({ queryKey: ['getUserAddedTests'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to delete test'}`);
    },

    retry: false,
  });
};

export const useUpdateTests = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    { testId: number; cost: number; labIds: number[] }
  >({
    mutationFn: UpdateTests, // ✅ Mutation function matches the expected parameters
    onSuccess: () => {
      toast.success('Test successfully Updated!');
      queryClient.invalidateQueries({ queryKey: ['getUserAddedTests'] });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error(`Error: ${error.message || 'Failed to update test'}`);
    },

    retry: false,
  });
};
export const useGetAllParameters = () => {
  return useQuery({
    queryKey: ['all-parameters'],
    queryFn:getAllParameters,
    staleTime: 1000 * 60 * 5, // Optional: cache for 5 minutes
  });
};
export const userCommonTests=(search:string)=>{
  return useQuery({
    queryKey:["commonTests",search],
    queryFn:()=>fetchCommonTests(search),
    enabled:!!search,
    staleTime:5*60*1000,
  });

};
export const basicTests=()=>{
  return useQuery({
    queryKey:["basicTests"],
    queryFn:getBasicTests,
    staleTime:5*60*1000,
  });

};

export const useDeleteOfferingsTests = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) => deleteOfferings(ids),
    onSuccess: () => {
      toast.success('Offerings deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['allTestsList'] });
      queryClient.invalidateQueries({ queryKey: ['getUserAddedTests'] }); // Optional: depends on where it's used
    },
    onError: (error: any) => {
      console.error('Error deleting offerings:', error);
      toast.error(`Error: ${error?.message || 'Failed to delete offerings'}`);
    },
    retry: false,
  });
};
