import { EDashboardSortDirection, EPeriod } from '@/lib';

export interface ITopProductRequest {
  period: EPeriod;
  sortBy: EDashboardSortDirection;
}

export interface ITopProductResponse {
  period: EPeriod;
  sortBy: EDashboardSortDirection;
  fromDate: string;
  toDate: string;
  topProducts: Array<{
    productUnitId: number;
    productId: number;
    productName: string;
    unitName: string;
    barcode: string;
    totalQuantitySold: number;
    totalRevenue: number;
    rank: number;
  }>;
}
