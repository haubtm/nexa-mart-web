import type { IBaseListRequest } from '@/dtos';

export const categoryKeys = {
  all: ['category'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...categoryKeys.lists(), { filters }] as const,
  root: () => [...categoryKeys.all, 'root'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
};
