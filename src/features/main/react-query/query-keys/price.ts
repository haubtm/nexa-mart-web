import type { IBaseListRequest } from '@/dtos';

export const priceKeys = {
  all: ['price'] as const,
  lists: () => [...priceKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...priceKeys.lists(), { filters }] as const,
  listVariants: (filters: IBaseListRequest) =>
    [...priceKeys.lists(), 'variants', { filters }] as const,
  byIds: () => [...priceKeys.all, 'byIds'] as const,
  byId: (id: number) => [...priceKeys.byIds(), id] as const,
  details: () => [...priceKeys.all, 'detail'] as const,
  detail: (id: number) => [...priceKeys.details(), id] as const,
  category: () => [...priceKeys.all, 'category'] as const,
  categoryDetail: (id: number) => [...priceKeys.category(), id] as const,
};
