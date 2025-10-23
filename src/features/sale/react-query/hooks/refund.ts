import { useMutation, useQuery } from '@tanstack/react-query';
import { refundKeys } from '../query-keys';
import type {
  IRefundByIdRequest,
  IRefundCalculateRequest,
  IRefundCheckQuantityByIdRequest,
  IRefundListRequest,
} from '@/dtos';
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

export const useRefundCalculate = (body: IRefundCalculateRequest) => {
  return useQuery({
    queryKey: refundKeys.calculate(body),
    queryFn: async () => await refundApi.calculate(body),
  });
};

export const useRefundCheckQuantity = (
  body: IRefundCheckQuantityByIdRequest,
) => {
  return useQuery({
    queryKey: refundKeys.checkQuantity(body),
    queryFn: async () => await refundApi.checkQuantity(body),
  });
};

export const useRefundCreate = () => {
  return useMutation({
    mutationFn: refundApi.create,
  });
};
