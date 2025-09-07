import type {
  IBaseListRequest,
  IBrandByIdRequest,
  IBrandCreateRequest,
  IBrandCreateResponse,
  IBrandDeleteRequest,
  IBrandDeleteResponse,
  IBrandListResponse,
  IBrandUpdateRequest,
  IBrandUpdateResponse,
  IBrandByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/brands';

export const brandApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IBrandListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  byId: async (body: IBrandByIdRequest) => {
    const response = await apiService.get<IBrandByIdResponse>(
      `${BASE_ENDPOINT}/${body.brandId}`,
    );

    return response;
  },

  create: async (body: IBrandCreateRequest) => {
    const response = await apiService.post<IBrandCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: IBrandUpdateRequest) => {
    const response = await apiService.put<IBrandUpdateResponse>(
      `${BASE_ENDPOINT}/${body.brandId}`,
      body,
    );

    return response;
  },

  delete: async (body: IBrandDeleteRequest) => {
    const response = await apiService.delete<IBrandDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },
};
