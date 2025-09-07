import type {
  IProductImageByIdRequest,
  IProductImageCreateRequest,
  IProductImageCreateResponse,
  IProductImageDeleteRequest,
  IProductImageDeleteResponse,
  IProductImageByIdResponse,
  IProductImageDeleteAllRequest,
  IProductImageDeleteAllResponse,
  IProductImageSortOrderUpdateRequest,
  IProductImageSortOrderUpdateResponse,
  IProductImageAltUpdateRequest,
  IProductImageAltUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/product-images';

export const productImageApi = {
  byId: async (body: IProductImageByIdRequest) => {
    const response = await apiService.get<IProductImageByIdResponse>(
      `${BASE_ENDPOINT}/${body.productId}`,
    );

    return response;
  },

  create: async (body: IProductImageCreateRequest) => {
    const formData = new FormData();
    body.imageFiles.forEach((file) => {
      formData.append('files', file);
    });

    const response = await apiService.post<IProductImageCreateResponse>(
      `${BASE_ENDPOINT}/upload-multiple?productId=${body.productId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  },

  updateSort: async (body: IProductImageSortOrderUpdateRequest) => {
    const response =
      await apiService.post<IProductImageSortOrderUpdateResponse>(
        `${BASE_ENDPOINT}/sort-order`,
        body,
      );
    return response;
  },

  updateAlt: async (body: IProductImageAltUpdateRequest) => {
    const response = await apiService.put<IProductImageAltUpdateResponse>(
      `${BASE_ENDPOINT}/${body.imageId}/alt`,
      body,
    );

    return response;
  },

  deleteImage: async (body: IProductImageDeleteRequest) => {
    const response = await apiService.delete<IProductImageDeleteResponse>(
      `${BASE_ENDPOINT}/${body.ids}`,
    );

    return response;
  },

  deleteAll: async (body: IProductImageDeleteAllRequest) => {
    const response = await apiService.delete<IProductImageDeleteAllResponse>(
      `${BASE_ENDPOINT}/product/${body.productId}`,
    );

    return response;
  },
};
