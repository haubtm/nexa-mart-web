import type { IBaseListRequest } from '@/dtos';

export const refundKeys = {
  all: ['refund'] as const,
  lists: () => [...refundKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...refundKeys.lists(), { filters }] as const,
  details: () => [...refundKeys.all, 'detail'] as const,
  detail: (id?: number) => [...refundKeys.details(), id] as const,
};
