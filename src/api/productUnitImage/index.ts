import type {
  IProductUnitImageAssignRequest,
  IProductUnitImageAssignResponse,
  IProductUnitImageByIdRequest,
  IProductUnitImageByIdResponse,
  IProductUnitImagePrimaryRequest,
  IProductUnitImagePrimaryResponse,
  IProductUnitImageUploadRequest,
  IProductUnitImageUploadResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/product-unit-images';

export const productUnitImageApi = {
  byId: async (body: IProductUnitImageByIdRequest) => {
    const response = await apiService.get<IProductUnitImageByIdResponse>(
      `${BASE_ENDPOINT}/${body.productUnitId}`,
    );

    return response;
  },

  upload: async (body: IProductUnitImageUploadRequest) => {
    const formData = new FormData();
    formData.append('imageFile', body.imageFile);
    formData.append('productUnitId', body.productUnitId.toString());
    body?.imageAlt && formData.append('imageAlt', body.imageAlt);
    formData.append('isPrimary', body.isPrimary.toString());
    body?.displayOrder &&
      formData.append('displayOrder', body.displayOrder.toString());

    const response = await apiService.post<IProductUnitImageUploadResponse>(
      `${BASE_ENDPOINT}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response;
  },

  assign: async (body: IProductUnitImageAssignRequest) => {
    const response = await apiService.post<IProductUnitImageAssignResponse>(
      `${BASE_ENDPOINT}/assign`,
      body,
    );

    return response;
  },

  primary: async (body: IProductUnitImagePrimaryRequest) => {
    const response = await apiService.put<IProductUnitImagePrimaryResponse>(
      `${BASE_ENDPOINT}/primary`,
      body,
    );
    return response;
  },
};
