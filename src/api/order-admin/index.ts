import type {
  IAdminOrderByIdRequest,
  IAdminOrderByIdResponse,
  IAdminOrderCancelRequest,
  IAdminOrderCancelResponse,
  IAdminOrderListRequest,
  IAdminOrderListResponse,
  IAdminOrderUpdateStatusRequest,
  IAdminOrderUpdateStatusResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/admin/orders';

export const orderAdminApi = {
  list: async (body: IAdminOrderListRequest) => {
    const response = await apiService.get<IAdminOrderListResponse>(
      `${BASE_ENDPOINT}`,
      { params: body },
    );

    return response;
  },

  byId: async (body: IAdminOrderByIdRequest) => {
    const response = await apiService.get<IAdminOrderByIdResponse>(
      `${BASE_ENDPOINT}/${body.orderId}`,
      { params: body },
    );

    return response;
  },

  updateStatus: async (body: IAdminOrderUpdateStatusRequest) => {
    const response = await apiService.put<IAdminOrderUpdateStatusResponse>(
      `${BASE_ENDPOINT}/${body.orderId}/status`,
      body,
    );

    return response;
  },

  cancel: async (body: IAdminOrderCancelRequest) => {
    const response = await apiService.post<IAdminOrderCancelResponse>(
      `${BASE_ENDPOINT}/${body.orderId}/cancel`,
      body,
    );

    return response;
  },
};
