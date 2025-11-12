import { useQuery } from '@tanstack/react-query';
import { reportKeys } from '../query-keys';
import type {
  IReportCustomerSaleRequest,
  IReportPromotionRequest,
  IReportReturnRequest,
  IReportSaleDailyRequest,
} from '@/dtos';
import { reportApi } from '@/api';

export const useReportSaleDaily = (filters: IReportSaleDailyRequest) => {
  return useQuery({
    queryKey: reportKeys.saleDaily(filters),
    queryFn: async () => await reportApi.saleDaily(filters),
  });
};

export const useReportReturn = (filters: IReportReturnRequest) => {
  return useQuery({
    queryKey: reportKeys.return(filters),
    queryFn: async () => await reportApi.return(filters),
  });
};

export const useReportPromotion = (filters: IReportPromotionRequest) => {
  return useQuery({
    queryKey: reportKeys.promotion(filters),
    queryFn: async () => await reportApi.promotion(filters),
  });
};

export const useReportCustomerSale = (filters: IReportCustomerSaleRequest) => {
  return useQuery({
    queryKey: reportKeys.customerSale(filters),
    queryFn: async () => await reportApi.customerSale(filters),
  });
};
