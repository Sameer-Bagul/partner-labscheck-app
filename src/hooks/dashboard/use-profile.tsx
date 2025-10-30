// /hooks/use-search.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


type SearchItem = {
  id: number;
  name: string;
  type: 'test' | 'lab';
};

type Params = {
  search_text: string;
  pincode?: string;
};

const fetchSearchResults = async (params: Params): Promise<SearchItem[]> => {
  const response = await axios.get('/api/search', {
    params,
  });
  return response.data;
};

export const useGetSearch = (params: Params) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => fetchSearchResults(params),
    enabled: !!params.search_text, // don't run if search_text is empty
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
  });
};