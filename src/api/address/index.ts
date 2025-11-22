import axios from 'axios';
import type {
  IProvincesByIdRequest,
  IProvincesByIdResponse,
  IProvincesListRequest,
  IProvincesListResponse,
  IWardsByIdRequest,
  IWardsByIdResponse,
  IWardsListRequest,
  IWardsListResponse,
} from '@/dtos';

const BASE_ENDPOINT = 'https://provinces.open-api.vn/api/v2';

const externalApiService = axios.create({
  baseURL: BASE_ENDPOINT,
  timeout: 30000,
});

export const addressApi = {
  listProvinces: async (params?: IProvincesListRequest) => {
    const response = await externalApiService.get<IProvincesListResponse>(
      '/p',
      { params },
    );
    return response.data;
  },

  listWards: async (params?: IWardsListRequest) => {
    const response = await externalApiService.get<IWardsListResponse>('/w', {
      params,
    });
    return response.data;
  },

  provinceById: async (params: IProvincesByIdRequest) => {
    const response = await externalApiService.get<IProvincesByIdResponse>(
      `/p/${params.id}`,
      {},
    );
    return response.data;
  },

  wardById: async (params: IWardsByIdRequest) => {
    const response = await externalApiService.get<IWardsByIdResponse>(
      `/w/${params.id}`,
      {},
    );
    return response.data;
  },
};
