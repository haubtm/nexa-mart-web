import type {
  IMetricsRequest,
  IRevenueChartRequest,
  ITopProductRequest,
} from '@/dtos';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  topProducts: () => [...dashboardKeys.all, 'top-products'] as const,
  topProduct: (filters: ITopProductRequest) =>
    [...dashboardKeys.topProducts(), { filters }] as const,
  revenueCharts: () => [...dashboardKeys.all, 'revenue-charts'] as const,
  revenueChart: (filters: IRevenueChartRequest) =>
    [...dashboardKeys.revenueCharts(), { filters }] as const,
  metrics: () => [...dashboardKeys.all, 'metrics'] as const,
  metric: (filters: IMetricsRequest) =>
    [...dashboardKeys.metrics(), { filters }] as const,
};
