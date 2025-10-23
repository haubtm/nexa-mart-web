import { apiService } from '../axiosService';
import {
  IOrderByIdRequest,
  IOrderByIdResponse,
  IOrderByInvoiceIdRequest,
  IOrderByInvoiceIdResponse,
  IOrderListRequest,
  IOrderListResponse,
  ISaleCreateRequest,
  ISaleCreateResponse,
} from '@/dtos';

const BASE_ENDPOINT = '/sales';

export const saleApi = {
  list: async (body: IOrderListRequest) => {
    const response = await apiService.get<IOrderListResponse>(
      // `${BASE_ENDPOINT}/search`,
      `${BASE_ENDPOINT}`,
      { params: body },
    );

    return response;
  },

  byInvoiceId: async (body: IOrderByInvoiceIdRequest) => {
    const response = await apiService.get<IOrderByInvoiceIdResponse>(
      `${BASE_ENDPOINT}/${body.invoiceId}`,
      { params: body },
    );

    return response;
  },

  byId: async (body: IOrderByIdRequest) => {
    const response = await apiService.get<IOrderByIdResponse>(
      `${BASE_ENDPOINT}/orders/${body.orderId}/status`,
      { params: body },
    );

    return response;
  },

  create: async (body: ISaleCreateRequest) => {
    const response = await apiService.post<ISaleCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );
    return response;
  },
};
