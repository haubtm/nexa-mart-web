import type {
  IReportCustomerSaleRequest,
  IReportCustomerSaleResponse,
  IReportPromotionRequest,
  IReportPromotionResponse,
  IReportReturnRequest,
  IReportReturnResponse,
  IReportSaleDailyRequest,
  IReportSaleDailyResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/reports';

export const reportApi = {
  saleDaily: async (body: IReportSaleDailyRequest) => {
    const response = await apiService.post<IReportSaleDailyResponse>(
      `${BASE_ENDPOINT}/sales-daily`,
      body,
    );
    return response;
  },

  return: async (body: IReportReturnRequest) => {
    const response = await apiService.post<IReportReturnResponse>(
      `${BASE_ENDPOINT}/returns`,
      body,
    );
    return response;
  },

  promotion: async (body: IReportPromotionRequest) => {
    const response = await apiService.post<IReportPromotionResponse>(
      `${BASE_ENDPOINT}/promotions`,
      body,
    );
    return response;
  },

  customerSale: async (body: IReportCustomerSaleRequest) => {
    const response = await apiService.post<IReportCustomerSaleResponse>(
      `${BASE_ENDPOINT}/customer-sales`,
      body,
    );
    return response;
  },
};
