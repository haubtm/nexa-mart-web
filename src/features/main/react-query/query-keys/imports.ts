import type { IBaseListRequest } from '@/dtos';

export const importsKeys = {
  all: ['imports'] as const,
  lists: () => [...importsKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...importsKeys.lists(), { filters }] as const,
  details: () => [...importsKeys.all, 'detail'] as const,
  detail: (id: number) => [...importsKeys.details(), id] as const,
};
