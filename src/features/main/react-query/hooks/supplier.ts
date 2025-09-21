import { useMutation, useQuery } from '@tanstack/react-query';
import { supplierKeys } from '../query-keys';
import type { IBaseListRequest, ISupplierByIdRequest } from '@/dtos';
import { supplierApi } from '@/api';

export const useSupplierList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: supplierKeys.list(filters),
    queryFn: async () => await supplierApi.list(filters),
  });
};

export const useSupplierById = (body: ISupplierByIdRequest) => {
  return useQuery({
    queryKey: supplierKeys.detail(body.id),
    queryFn: async () => await supplierApi.byId(body),
  });
};

export const useSupplierCreate = () => {
  return useMutation({
    mutationFn: supplierApi.create,
  });
};

export const useSupplierUpdate = () => {
  return useMutation({
    mutationFn: supplierApi.update,
  });
};

export const useSupplierDelete = () => {
  return useMutation({
    mutationFn: supplierApi.delete,
  });
};
