import type { IBaseListRequest } from '@/dtos';

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...inventoryKeys.lists(), { filters }] as const,
};
