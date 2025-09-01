import type {
  IBaseListRequest,
  IEmployeeByIdRequest,
  IEmployeeByIdResponseData,
  IEmployeeCreateRequest,
  IEmployeeCreateResponse,
  IEmployeeDeleteRequest,
  IEmployeeDeleteResponse,
  IEmployeeListResponse,
  IEmployeeUpdateRequest,
  IEmployeeUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/employees';

export const employeeApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IEmployeeListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  byId: async (body: IEmployeeByIdRequest) => {
    const response = await apiService.get<IEmployeeByIdResponseData>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  create: async (body: IEmployeeCreateRequest) => {
    const response = await apiService.post<IEmployeeCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: IEmployeeUpdateRequest) => {
    const response = await apiService.put<IEmployeeUpdateResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      body,
    );

    return response;
  },

  delete: async (body: IEmployeeDeleteRequest) => {
    const response = await apiService.delete<IEmployeeDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },
};
