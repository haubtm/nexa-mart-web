import type { IBaseListRequest } from '@/dtos';

export const supplierKeys = {
  all: ['supplier'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...supplierKeys.lists(), { filters }] as const,
  details: () => [...supplierKeys.all, 'detail'] as const,
  detail: (id: number) => [...supplierKeys.details(), id] as const,
};
