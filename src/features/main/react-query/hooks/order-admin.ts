import { useMutation, useQuery } from '@tanstack/react-query';
import { orderAdminKeys } from '../query-keys';

import { orderAdminApi } from '@/api';
import { IAdminOrderByIdRequest, IAdminOrderListRequest } from '@/dtos';

export const useOrderAdminList = (filters: IAdminOrderListRequest) => {
  return useQuery({
    queryKey: orderAdminKeys.list(filters),
    queryFn: async () => await orderAdminApi.list(filters),
  });
};

export const useOrderAdminById = (body: IAdminOrderByIdRequest) => {
  return useQuery({
    queryKey: orderAdminKeys.detail(body.orderId),
    queryFn: async () => await orderAdminApi.byId(body),
  });
};

export const useOrderAdminUpdateStatus = () => {
  return useMutation({
    mutationFn: orderAdminApi.updateStatus,
  });
};

export const useOrderAdminCancel = () => {
  return useMutation({
    mutationFn: orderAdminApi.cancel,
  });
};
