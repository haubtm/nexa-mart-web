import {
  IReportCustomerSaleRequest,
  IReportPromotionRequest,
  IReportReturnRequest,
  IReportSaleDailyRequest,
} from '@/dtos';

export const reportKeys = {
  all: ['report'] as const,
  saleDailies: () => [...reportKeys.all, 'sales-daily'] as const,
  saleDaily: (filters: IReportSaleDailyRequest) =>
    [...reportKeys.saleDailies(), { filters }] as const,
  returns: () => [...reportKeys.all, 'returns'] as const,
  return: (filters: IReportReturnRequest) =>
    [...reportKeys.returns(), { filters }] as const,
  promotions: () => [...reportKeys.all, 'promotions'] as const,
  promotion: (filters: IReportPromotionRequest) =>
    [...reportKeys.promotions(), { filters }] as const,
  customerSales: () => [...reportKeys.all, 'customer-sales'] as const,
  customerSale: (filters: IReportCustomerSaleRequest) =>
    [...reportKeys.customerSales(), { filters }] as const,
};
