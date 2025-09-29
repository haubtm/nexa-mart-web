import type {
  IProductByIdRequest,
  IProductCreateRequest,
  IProductCreateResponse,
  IProductDeleteRequest,
  IProductDeleteResponse,
  IProductListResponse,
  IProductUpdateRequest,
  IProductUpdateResponse,
  IProductByIdResponse,
  IProductListRequest,
  IProductAddUnitsRequest,
  IProductAddUnitsResponse,
  IProductUnitUpdateRequest,
  IProductUnitUpdateResponse,
  IProductUnitDeleteRequest,
  IProductUnitDeleteResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/products';

export const productApi = {
  list: async (body: IProductListRequest) => {
    const response = await apiService.post<IProductListResponse>(
      `${BASE_ENDPOINT}/search`,
      body,
    );

    return response;
  },

  addUnits: async (body: IProductAddUnitsRequest) => {
    const response = await apiService.post<IProductAddUnitsResponse>(
      `${BASE_ENDPOINT}/${body.productId}/units`,
      body.unit,
    );

    return response;
  },

  byId: async (body: IProductByIdRequest) => {
    const response = await apiService.get<IProductByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  create: async (body: IProductCreateRequest) => {
    const response = await apiService.post<IProductCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  update: async (body: IProductUpdateRequest) => {
    const response = await apiService.put<IProductUpdateResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
      body,
    );

    return response;
  },

  updateUnits: async (body: IProductUnitUpdateRequest) => {
    const response = await apiService.put<IProductUnitUpdateResponse>(
      `${BASE_ENDPOINT}/${body.productId}/units/${body.unitId}`,
      body,
    );
    return response;
  },

  delete: async (body: IProductDeleteRequest) => {
    const response = await apiService.delete<IProductDeleteResponse>(
      `${BASE_ENDPOINT}/batch`,
      { data: body.ids },
    );

    return response;
  },

  deleteUnit: async (body: IProductUnitDeleteRequest) => {
    const response = await apiService.delete<IProductUnitDeleteResponse>(
      `${BASE_ENDPOINT}/${body.productId}/units/${body.unitId}`,
    );
    return response;
  },
};
