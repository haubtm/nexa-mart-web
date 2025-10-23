import { useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import type { IProductListRequest } from '@/dtos';
import { productApi } from '@/api';

export const useProductList = (filters: IProductListRequest) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => await productApi.list(filters),
  });
};
