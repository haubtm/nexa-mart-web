import type { IBaseListRequest } from '@/dtos';

export const attributeKeys = {
  all: ['attribute'] as const,
  lists: () => [...attributeKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...attributeKeys.lists(), { filters }] as const,
  valueByIds: () => [...attributeKeys.all, 'valueById'] as const,
  valueById: (id: number) => [...attributeKeys.valueByIds(), id] as const,
  details: () => [...attributeKeys.all, 'detail'] as const,
  detail: (id: number) => [...attributeKeys.details(), id] as const,
};
