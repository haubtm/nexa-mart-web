import type { IBaseListRequest } from '@/dtos';

export const employeeKeys = {
  all: ['employee'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...employeeKeys.lists(), { filters }] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: number) => [...employeeKeys.details(), id] as const,
};
