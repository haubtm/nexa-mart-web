import { useMutation, useQuery } from '@tanstack/react-query';
import { inventoryKeys } from '../query-keys';
import type { IBaseListRequest } from '@/dtos';
import { inventoryApi } from '@/api';

export const useInventoryList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: async () => await inventoryApi.history(filters),
  });
};

export const useInventoryUpdate = () => {
  return useMutation({
    mutationFn: inventoryApi.update,
  });
};
