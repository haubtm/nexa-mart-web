import { useMutation, useQuery } from '@tanstack/react-query';
import { customerKeys } from '../query-keys';
import type { IBaseListRequest, ICustomerByIdRequest } from '@/dtos';
import { customerApi } from '@/api';

export const useCustomerList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: async () => await customerApi.list(filters),
  });
};

export const useCustomerById = (body: ICustomerByIdRequest) => {
  return useQuery({
    queryKey: customerKeys.detail(body.customerId),
    queryFn: async () => await customerApi.byId(body),
  });
};

export const useCustomerCreate = () => {
  return useMutation({
    mutationFn: customerApi.create,
  });
};

export const useCustomerUpdate = () => {
  return useMutation({
    mutationFn: customerApi.update,
  });
};

export const useCustomerDelete = () => {
  return useMutation({
    mutationFn: customerApi.delete,
  });
};
