import { useQuery } from '@tanstack/react-query';
import { customerKeys } from '../query-keys';
import type { IBaseListRequest } from '@/dtos';
import { customerApi } from '@/api';

export const useCustomerList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: async () => await customerApi.list(filters),
  });
};
