import type { IBaseListRequest } from '@/dtos';

export const attributeKeys = {
  all: ['attribute'] as const,
  lists: () => [...attributeKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...attributeKeys.lists(), { filters }] as const,
  details: () => [...attributeKeys.all, 'detail'] as const,
  detail: (id: number) => [...attributeKeys.details(), id] as const,
};
