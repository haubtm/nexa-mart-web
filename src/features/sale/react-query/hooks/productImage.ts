import { useQuery } from '@tanstack/react-query';
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
