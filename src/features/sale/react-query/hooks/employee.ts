import { useQuery } from '@tanstack/react-query';
import { employeeKeys } from '../query-keys';
import type { IBaseListRequest } from '@/dtos';
import { employeeApi } from '@/api';

export const useEmployeeList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: async () => await employeeApi.list(filters),
  });
};
