import { useQuery } from '@tanstack/react-query';
import { refundKeys } from '../query-keys';
import type { IRefundByIdRequest, IRefundListRequest } from '@/dtos';
import { refundApi } from '@/api';

export const useRefundList = (body: IRefundListRequest) => {
  return useQuery({
    queryKey: refundKeys.list(body),
    queryFn: async () => await refundApi.list(body),
  });
};

export const useRefundById = (body: IRefundByIdRequest) => {
  return useQuery({
    queryKey: refundKeys.detail(body.returnId),
    queryFn: async () => await refundApi.byId(body),
    enabled: !!body.returnId,
  });
};
