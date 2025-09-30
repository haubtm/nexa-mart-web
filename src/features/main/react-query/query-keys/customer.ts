import type { IBaseListRequest } from '@/dtos';

export const customerKeys = {
  all: ['customer'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: number) => [...customerKeys.details(), id] as const,
};
