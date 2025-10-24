import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '../query-keys';
import type { IReportListRequest } from '@/dtos';
import { reportApi } from '@/api';

export const useReportList = (filters: IReportListRequest) => {
  return useQuery({
    queryKey: reportKeys.list(filters),
    queryFn: async () => await reportApi.list(filters),
  });
};
