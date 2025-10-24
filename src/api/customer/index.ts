import type {
  IBaseListRequest,
  ICustomerByIdRequest,
  ICustomerCreateRequest,
  ICustomerCreateResponse,
  ICustomerDeleteRequest,
  ICustomerDeleteResponse,
  ICustomerListResponse,
  ICustomerUpdateRequest,
  ICustomerUpdateResponse,
  ICustomerByIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/customers';

export const customerApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.post<ICustomerListResponse>(
      `${BASE_ENDPOINT}/list`,
      {
        searchTerm: body.search,
        page: body.page,
        limit: body.limit,
      },
    );

    return response;
  },

  byId: async (body: ICustomerByIdRequest) => {
    const response = await apiService.get<ICustomerByIdResponse>(
      `${BASE_ENDPOINT}/${body.customerId}`,
    );

    return response;
  },

  create: async (body: ICustomerCreateRequest) => {
    const response = await apiService.post<ICustomerCreateResponse>(
      `${BASE_ENDPOINT}/admin-create`,
      body,
    );

    return response;
  },

  update: async (body: ICustomerUpdateRequest) => {
    const response = await apiService.put<ICustomerUpdateResponse>(
      `${BASE_ENDPOINT}/${body.customerId}`,
      body,
    );

    return response;
  },

  delete: async (body: ICustomerDeleteRequest) => {
    const response = await apiService.delete<ICustomerDeleteResponse>(
      `${BASE_ENDPOINT}/bulk-delete`,
      { data: body },
    );

    return response;
  },
};
