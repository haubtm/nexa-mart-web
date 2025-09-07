import type { IBaseListRequest } from '@/dtos';

export const brandKeys = {
  all: ['brand'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...brandKeys.lists(), { filters }] as const,
  details: () => [...brandKeys.all, 'detail'] as const,
  detail: (id: number) => [...brandKeys.details(), id] as const,
};
