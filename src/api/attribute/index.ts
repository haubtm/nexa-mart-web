import type {
  IBaseListRequest,
  IAttributeByIdRequest,
  IAttributeCreateRequest,
  IAttributeCreateResponse,
  IAttributeDeleteRequest,
  IAttributeDeleteResponse,
  IAttributeListResponse,
  IAttributeUpdateRequest,
  IAttributeUpdateResponse,
  IAttributeByIdResponse,
  IAttributeValueByIdRequest,
  IAttributeValueByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/attributes';

export const attributeApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IAttributeListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  valueById: async (body: IAttributeValueByIdRequest) => {
    const response = await apiService.get<IAttributeValueByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}/values`,
    );

    return response;
  },

  byId: async (body: IAttributeByIdRequest) => {
    const response = await apiService.get<IAttributeByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  create: async (body: IAttributeCreateRequest) => {
    const response = await apiService.post<IAttributeCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: IAttributeUpdateRequest) => {
    const response = await apiService.put<IAttributeUpdateResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      body,
    );

    return response;
  },

  delete: async (body: IAttributeDeleteRequest) => {
    const response = await apiService.delete<IAttributeDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },
};
