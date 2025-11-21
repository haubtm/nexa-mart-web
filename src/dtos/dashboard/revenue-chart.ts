import { EPeriod } from '@/lib';

export interface IRevenueChartRequest {
  period: EPeriod;
}

export interface IRevenueChartResponse {
  period: EPeriod;
  fromDate: string;
  toDate: string;
  totalRevenue: number;
  totalInvoices: number;
  details: Array<{
    label: string;
    revenue: number;
    invoiceCount: number;
  }>;
}
