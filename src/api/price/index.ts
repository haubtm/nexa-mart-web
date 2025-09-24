import type {
  IPriceByIdRequest,
  IPriceCreateRequest,
  IPriceCreateResponse,
  IPriceDeleteRequest,
  IPriceDeleteResponse,
  IPriceListResponse,
  IPriceUpdateRequest,
  IPriceUpdateResponse,
  IPriceByIdResponse,
  IPriceListRequest,
  IPriceDetailByIdRequest,
  IPriceDetailByIdResponse,
  IPriceDetailCreateRequest,
  IPriceDetailCreateResponse,
  IPriceDetailDeleteRequest,
  IPriceDetailDeleteResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/prices';

export const priceApi = {
  list: async (body: IPriceListRequest) => {
    const response = await apiService.post<IPriceListResponse>(
      `${BASE_ENDPOINT}/search`,
      body,
    );

    return response;
  },

  byId: async (body: IPriceByIdRequest) => {
    const response = await apiService.get<IPriceByIdResponse>(
      `${BASE_ENDPOINT}/${body.priceId}`,
      { params: { includes: body.includeDetails } },
    );

    return response;
  },

  detailById: async (body: IPriceDetailByIdRequest) => {
    const response = await apiService.get<IPriceDetailByIdResponse>(
      `${BASE_ENDPOINT}/${body.priceId}/details`,
    );

    return response;
  },

  create: async (body: IPriceCreateRequest) => {
    const response = await apiService.post<IPriceCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  createDetail: async (body: IPriceDetailCreateRequest) => {
    const response = await apiService.post<IPriceDetailCreateResponse>(
      `${BASE_ENDPOINT}/${body.priceId}/details`,
      body,
    );

    return response;
  },

  update: async (body: IPriceUpdateRequest) => {
    const response = await apiService.put<IPriceUpdateResponse>(
      `${BASE_ENDPOINT}/${body.priceId}`,
      body,
    );

    return response;
  },

  delete: async (body: IPriceDeleteRequest) => {
    const response = await apiService.delete<IPriceDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },

  deleteDetail: async (body: IPriceDetailDeleteRequest) => {
    const response = await apiService.delete<IPriceDetailDeleteResponse>(
      `${BASE_ENDPOINT}/${body.priceId}/details`,
      { data: body.priceDetailIds },
    );

    return response;
  },
};
