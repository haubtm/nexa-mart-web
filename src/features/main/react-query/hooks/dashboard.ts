import { useQuery } from '@tanstack/react-query';
import { dashboardKeys } from '../query-keys';
import type {
  IMetricsRequest,
  IRevenueChartRequest,
  ITopProductRequest,
} from '@/dtos';
import { dashboardApi } from '@/api';

export const useTopProduct = (filters: ITopProductRequest) => {
  return useQuery({
    queryKey: dashboardKeys.topProduct(filters),
    queryFn: async () => await dashboardApi.topProduct(filters),
  });
};

export const useRevenueChart = (filters: IRevenueChartRequest) => {
  return useQuery({
    queryKey: dashboardKeys.revenueChart(filters),
    queryFn: async () => await dashboardApi.revenueChart(filters),
  });
};

export const useMetrics = (filters: IMetricsRequest) => {
  return useQuery({
    queryKey: dashboardKeys.metric(filters),
    queryFn: async () => await dashboardApi.metrics(filters),
  });
};
