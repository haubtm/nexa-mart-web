import type {
  IBaseListRequest,
  ICategoryByIdRequest,
  ICategoryCreateRequest,
  ICategoryCreateResponse,
  ICategoryDeleteRequest,
  ICategoryDeleteResponse,
  ICategoryListResponse,
  ICategoryUpdateRequest,
  ICategoryUpdateResponse,
  ICategoryByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/categories';

export const categoryApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<ICategoryListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  byId: async (body: ICategoryByIdRequest) => {
    const response = await apiService.get<ICategoryByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  create: async (body: ICategoryCreateRequest) => {
    const response = await apiService.post<ICategoryCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: ICategoryUpdateRequest) => {
    const response = await apiService.put<ICategoryUpdateResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      body,
    );

    return response;
  },

  delete: async (body: ICategoryDeleteRequest) => {
    const response = await apiService.delete<ICategoryDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },
};
