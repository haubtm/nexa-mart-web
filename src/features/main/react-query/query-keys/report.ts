import { IReportListRequest } from '@/dtos';

export const reportKeys = {
  all: ['report'] as const,
  lists: () => [...reportKeys.all, 'list'] as const,
  list: (filters: IReportListRequest) =>
    [...reportKeys.lists(), { filters }] as const,
};
