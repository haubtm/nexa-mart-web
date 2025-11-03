import { productUnitImageApi } from '@/api';
import { IProductUnitImageByIdRequest } from '@/dtos';
import { useMutation, useQuery } from '@tanstack/react-query';
import { productUnitImageKeys } from '../query-keys';

export const useProductUnitImageById = (body: IProductUnitImageByIdRequest) => {
  return useQuery({
    queryKey: productUnitImageKeys.byId(body.productUnitId),
    queryFn: async () => await productUnitImageApi.byId(body),
  });
};

export const useProductUnitImageUpload = () => {
  return useMutation({
    mutationFn: productUnitImageApi.upload,
  });
};

export const useProductUnitImageAssign = () => {
  return useMutation({
    mutationFn: productUnitImageApi.assign,
  });
};

export const useProductUnitImagePrimary = () => {
  return useMutation({
    mutationFn: productUnitImageApi.primary,
  });
};
