import { useQuery } from 'react-query';
import { fetchAllData } from './dataService';

export const useApiData = (type) => {
  return useQuery(
    [type], 
    () => fetchAllData(type),
    {
      staleTime: 10 * 60 * 1000, // 10 minutos de cache
      refetchOnWindowFocus: false
    }
  );
};