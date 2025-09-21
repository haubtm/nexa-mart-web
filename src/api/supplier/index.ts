import type {
  IBaseListRequest,
  ISupplierByIdRequest,
  ISupplierCreateRequest,
  ISupplierCreateResponse,
  ISupplierDeleteRequest,
  ISupplierDeleteResponse,
  ISupplierListResponse,
  ISupplierUpdateRequest,
  ISupplierUpdateResponse,
  ISupplierByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/suppliers';

export const supplierApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.post<ISupplierListResponse>(
      `${BASE_ENDPOINT}/list`,
      body,
    );

    return response;
  },

  byId: async (body: ISupplierByIdRequest) => {
    const response = await apiService.get<ISupplierByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  create: async (body: ISupplierCreateRequest) => {
    const response = await apiService.post<ISupplierCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: ISupplierUpdateRequest) => {
    const response = await apiService.put<ISupplierUpdateResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      body,
    );

    return response;
  },

  delete: async (body: ISupplierDeleteRequest) => {
    const response = await apiService.delete<ISupplierDeleteResponse>(
      `${BASE_ENDPOINT}/delete`,
      { data: body },
    );

    return response;
  },
};
