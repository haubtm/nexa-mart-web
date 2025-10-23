import type { IOrderByIdRequest, IOrderListRequest } from '@/dtos';

export const saleKeys = {
  all: ['sale'] as const,
  lists: () => [...saleKeys.all, 'list'] as const,
  list: (filters: IOrderListRequest) =>
    [...saleKeys.lists(), { filters }] as const,
  byId: (filters: IOrderByIdRequest) =>
    [...saleKeys.all, 'byId', { filters }] as const,
};
