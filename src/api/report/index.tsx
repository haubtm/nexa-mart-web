import type { IReportListRequest, IReportListResponse } from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/reports';

export const reportApi = {
  list: async (body: IReportListRequest) => {
    const response = await apiService.post<IReportListResponse>(
      `${BASE_ENDPOINT}/sales-daily`,
      body,
    );

    return response;
  },
};
