import { useMutation, useQuery } from '@tanstack/react-query';
import { saleKeys } from '../query-keys';
import type { IOrderByIdRequest, IOrderListRequest } from '@/dtos';
import { saleApi } from '@/api';

export const useOrderList = (filters: IOrderListRequest) => {
  return useQuery({
    queryKey: saleKeys.list(filters),
    queryFn: async () => await saleApi.list(filters),
  });
};

export const useOrderStatus = (filters: IOrderByIdRequest) => {
  return useQuery({
    queryKey: saleKeys.byId(filters),
    queryFn: async () => await saleApi.byId(filters),
  });
};

export const useOrderCreate = () => {
  return useMutation({
    mutationFn: saleApi.create,
  });
};
