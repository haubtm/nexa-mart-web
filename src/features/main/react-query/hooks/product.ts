import { useMutation, useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import type { IProductByIdRequest, IProductListRequest } from '@/dtos';
import { productApi } from '@/api';

export const useProductList = (filters: IProductListRequest) => {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: async () => await productApi.list(filters),
  });
};

export const useProductById = (body: IProductByIdRequest) => {
  return useQuery({
    queryKey: productKeys.detail(body.id),
    queryFn: async () => await productApi.byId(body),
  });
};

export const useProductCreate = () => {
  return useMutation({
    mutationFn: productApi.create,
  });
};

export const useProductUpdate = () => {
  return useMutation({
    mutationFn: productApi.update,
  });
};

export const useProductDelete = () => {
  return useMutation({
    mutationFn: productApi.delete,
  });
};

export const useProductAddUnits = () => {
  return useMutation({
    mutationFn: productApi.addUnits,
  });
};

export const useProductUnitUpdate = () => {
  return useMutation({
    mutationFn: productApi.updateUnits,
  });
};

export const useProductUnitDelete = () => {
  return useMutation({
    mutationFn: productApi.deleteUnit,
  });
};

export const useProductExport = () => {
  return useMutation({
    mutationFn: productApi.export,
  });
};

export const useProductImport = () => {
  return useMutation({
    mutationFn: productApi.import,
  });
};
