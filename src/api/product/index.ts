import type {
  IBaseListRequest,
  IProductByIdRequest,
  IProductCreateRequest,
  IProductCreateResponse,
  IProductDeleteRequest,
  IProductDeleteResponse,
  IProductListResponse,
  IProductUpdateRequest,
  IProductUpdateResponse,
  IProductByIdResponse,
  IProductByCategoryIdResponse,
  IProductByCategoryIdRequest,
  IProductVariantListResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/products';

export const productApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.post<IProductListResponse>(
      `${BASE_ENDPOINT}/list`,
      body,
    );

    return response;
  },

  listVariants: async (body: IBaseListRequest) => {
    const response = await apiService.get<IProductVariantListResponse>(
      `${BASE_ENDPOINT}/variants/search?keyword=${body.search}`,
    );

    return response;
  },

  byId: async (body: IProductByIdRequest) => {
    const response = await apiService.get<IProductByIdResponse>(
      `${BASE_ENDPOINT}/${body.id}`,
    );

    return response;
  },

  byCategoryId: async (body: IProductByCategoryIdRequest) => {
    const response = await apiService.get<IProductByCategoryIdResponse>(
      `${BASE_ENDPOINT}/category/${body.categoryId}`,
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

  delete: async (body: IProductDeleteRequest) => {
    const response = await apiService.delete<IProductDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },
};
