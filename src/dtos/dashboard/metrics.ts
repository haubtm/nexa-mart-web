import { EPeriod } from '@/lib';

export interface IMetricsRequest {
  period: EPeriod;
}

export interface IMetricsResponse {
  period: EPeriod;
  fromDate: string;
  toDate: string;
  newCustomersCount: number;
  invoicesCount: number;
  invoicesTotalAmount: number;
  ordersCount: number;
  ordersTotalAmount: number;
  totalRevenue: number;
  returnsCount: number;
}
