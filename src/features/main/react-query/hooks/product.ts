import { useMutation, useQuery } from '@tanstack/react-query';
import { productKeys } from '../query-keys';
import type {
  IBaseListRequest,
  IProductByCategoryIdRequest,
  IProductByIdRequest,
} from '@/dtos';
import { productApi } from '@/api';

export const useProductList = (filters: IBaseListRequest) => {
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

export const useProductByCategoryId = (body: IProductByCategoryIdRequest) => {
  return useQuery({
    queryKey: productKeys.categoryDetail(body.categoryId),
    queryFn: async () => await productApi.byCategoryId(body),
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
