import type { IBaseListRequest } from '@/dtos';

export const productKeys = {
  all: ['product'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...productKeys.lists(), { filters }] as const,
  listVariants: (filters: IBaseListRequest) =>
    [...productKeys.lists(), 'variants', { filters }] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
  category: () => [...productKeys.all, 'category'] as const,
  categoryDetail: (id: number) => [...productKeys.category(), id] as const,
};
