import type {
  IMetricsRequest,
  IMetricsResponse,
  IRevenueChartRequest,
  IRevenueChartResponse,
  ITopProductRequest,
  ITopProductResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/dashboard';

export const dashboardApi = {
  topProduct: async (body: ITopProductRequest) => {
    const response = await apiService.get<ITopProductResponse>(
      `${BASE_ENDPOINT}/top-products`,
      {
        params: body,
      },
    );

    return response;
  },

  revenueChart: async (body: IRevenueChartRequest) => {
    const response = await apiService.get<IRevenueChartResponse>(
      `${BASE_ENDPOINT}/revenue-chart`,
      {
        params: body,
      },
    );

    return response;
  },

  metrics: async (body: IMetricsRequest) => {
    const response = await apiService.get<IMetricsResponse>(
      `${BASE_ENDPOINT}/metrics`,
      {
        params: body,
      },
    );

    return response;
  },
};
