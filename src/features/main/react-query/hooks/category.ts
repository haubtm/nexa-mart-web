import { useMutation, useQuery } from '@tanstack/react-query';
import { categoryKeys } from '../query-keys';
import type { IBaseListRequest, ICategoryByIdRequest } from '@/dtos';
import { categoryApi } from '@/api';

export const useCategoryList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: categoryKeys.list(filters),
    queryFn: async () => await categoryApi.list(filters),
  });
};

export const useCategoryById = (body: ICategoryByIdRequest) => {
  return useQuery({
    queryKey: categoryKeys.detail(body.id),
    queryFn: async () => await categoryApi.byId(body),
  });
};

export const useCategoryCreate = () => {
  return useMutation({
    mutationFn: categoryApi.create,
  });
};

export const useCategoryUpdate = () => {
  return useMutation({
    mutationFn: categoryApi.update,
  });
};

export const useCategoryDelete = () => {
  return useMutation({
    mutationFn: categoryApi.delete,
  });
};
