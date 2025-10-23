import type {
  IRefundListRequest,
  IRefundListResponse,
  IRefundByIdRequest,
  IRefundByIdResponse,
  IRefundCreateRequest,
  IRefundCreateResponse,
  IRefundCalculateRequest,
  IRefundCalculateResponse,
  IRefundCheckQuantityByIdRequest,
  IRefundCheckQuantityByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/refunds';

export const refundApi = {
  list: async (body: IRefundListRequest) => {
    const response = await apiService.get<IRefundListResponse>(
      `${BASE_ENDPOINT}`,
      { params: body },
    );

    return response;
  },

  byId: async (body: IRefundByIdRequest) => {
    const response = await apiService.get<IRefundByIdResponse>(
      `${BASE_ENDPOINT}/${body.returnId}/detail`,
    );

    return response;
  },

  create: async (body: IRefundCreateRequest) => {
    const response = await apiService.post<IRefundCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  calculate: async (body: IRefundCalculateRequest) => {
    const response = await apiService.post<IRefundCalculateResponse>(
      `${BASE_ENDPOINT}/calculate`,
      body,
    );
    return response;
  },

  checkQuantity: async (body: IRefundCheckQuantityByIdRequest) => {
    const response = await apiService.get<IRefundCheckQuantityByIdResponse>(
      `${BASE_ENDPOINT}/invoice/${body.invoiceId}/available-quantity`,
      { params: body },
    );
    return response;
  },
};
