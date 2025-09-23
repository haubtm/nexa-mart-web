import type { IBaseListRequest } from '@/dtos';

export const stockTakeKeys = {
  all: ['stockTake'] as const,
  lists: () => [...stockTakeKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...stockTakeKeys.lists(), { filters }] as const,
  details: () => [...stockTakeKeys.all, 'detail'] as const,
  detail: (id: number) => [...stockTakeKeys.details(), id] as const,
};
