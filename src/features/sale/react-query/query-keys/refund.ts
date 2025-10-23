import type {
  IBaseListRequest,
  IRefundCalculateRequest,
  IRefundCheckQuantityByIdRequest,
} from '@/dtos';

export const refundKeys = {
  all: ['refund'] as const,
  lists: () => [...refundKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...refundKeys.lists(), { filters }] as const,
  details: () => [...refundKeys.all, 'detail'] as const,
  detail: (id?: number) => [...refundKeys.details(), id] as const,
  calculates: () => [...refundKeys.all, 'calculate'] as const,
  calculate: (body: IRefundCalculateRequest) =>
    [...refundKeys.calculates(), { body }] as const,
  checkQuantities: () => [...refundKeys.all, 'check-quantity'] as const,
  checkQuantity: (body: IRefundCheckQuantityByIdRequest) =>
    [...refundKeys.checkQuantities(), { body }] as const,
};
