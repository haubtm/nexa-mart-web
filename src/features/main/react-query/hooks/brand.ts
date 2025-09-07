import { useMutation, useQuery } from '@tanstack/react-query';
import { brandKeys } from '../query-keys';
import type { IBaseListRequest, IBrandByIdRequest } from '@/dtos';
import { brandApi } from '@/api';

export const useBrandList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: brandKeys.list(filters),
    queryFn: async () => await brandApi.list(filters),
  });
};

export const useBrandById = (body: IBrandByIdRequest) => {
  return useQuery({
    queryKey: brandKeys.detail(body.brandId),
    queryFn: async () => await brandApi.byId(body),
  });
};

export const useBrandCreate = () => {
  return useMutation({
    mutationFn: brandApi.create,
  });
};

export const useBrandUpdate = () => {
  return useMutation({
    mutationFn: brandApi.update,
  });
};

export const useBrandDelete = () => {
  return useMutation({
    mutationFn: brandApi.delete,
  });
};
