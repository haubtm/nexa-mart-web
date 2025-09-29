import { useMutation, useQuery } from '@tanstack/react-query';
import { productImageKeys } from '../query-keys';
import type { IProductImageByIdRequest } from '@/dtos';
import { productImageApi } from '@/api';

export const useProductImageById = (body: IProductImageByIdRequest) => {
  return useQuery({
    queryKey: productImageKeys.detail(body.productId),
    queryFn: async () => await productImageApi.byId(body),
    enabled: !!body.productId,
  });
};

export const useProductImageCreate = () => {
  return useMutation({
    mutationFn: productImageApi.create,
  });
};

export const useProductImageUpdateAlt = () => {
  return useMutation({
    mutationFn: productImageApi.updateAlt,
  });
};

export const useProductImageUpdateSort = () => {
  return useMutation({
    mutationFn: productImageApi.updateSort,
  });
};

export const useProductImageDeleteImage = () => {
  return useMutation({
    mutationFn: productImageApi.deleteImage,
  });
};

export const useProductImageDeleteAll = () => {
  return useMutation({
    mutationFn: productImageApi.deleteAll,
  });
};
