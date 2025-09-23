import type {
  IBaseListRequest,
  IImportsByIdRequest,
  IImportsByIdResponse,
  IImportsBySupplierIdRequest,
  IImportsBySupplierIdResponse,
  IImportsCreateRequest,
  IImportsCreateResponse,
  IImportsListResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/imports';

export const importsApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IImportsListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  byId: async (body: IImportsByIdRequest) => {
    const response = await apiService.get<IImportsByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  bySupplierId: async (body: IImportsBySupplierIdRequest) => {
    const response = await apiService.get<IImportsBySupplierIdResponse>(
      `${BASE_ENDPOINT}/supplier/${body.supplierId}?page=${body.page}&size=${body.size}`,
    );

    return response;
  },

  create: async (body: IImportsCreateRequest) => {
    const response = await apiService.post<IImportsCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },
};
