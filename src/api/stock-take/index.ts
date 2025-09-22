import type {
  IBaseListRequest,
  IStockTakeByIdRequest,
  IStockTakeCreateRequest,
  IStockTakeCreateResponse,
  IStockTakeListResponse,
  IStockTakeUpdateRequest,
  IStockTakeUpdateResponse,
  IStockTakeByIdResponse,
  IStockTakeRefreshUpdateRequest,
  IStockTakeCompleteUpdateRequest,
  IStockTakeRefreshUpdateResponse,
  IStockTakeDetailUpdateRequest,
  IStockTakeDetailUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/stocktakes';

export const StockTakeApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IStockTakeListResponse>(
      `${BASE_ENDPOINT}`,
      {
        params: body,
      },
    );

    return response;
  },

  byId: async (body: IStockTakeByIdRequest) => {
    const response = await apiService.get<IStockTakeByIdResponse>(
      `${BASE_ENDPOINT}/${body.stocktakeId}`,
    );

    return response;
  },

  create: async (body: IStockTakeCreateRequest) => {
    const response = await apiService.post<IStockTakeCreateResponse>(
      `${BASE_ENDPOINT}`,
      body,
    );

    return response;
  },

  refresh: async (body: IStockTakeRefreshUpdateRequest) => {
    const response = await apiService.post<IStockTakeRefreshUpdateResponse>(
      `${BASE_ENDPOINT}/${body.stocktakeId}/refresh-expected-quantities`,
    );

    return response;
  },

  complete: async (body: IStockTakeCompleteUpdateRequest) => {
    const response = await apiService.post<IStockTakeCreateResponse>(
      `${BASE_ENDPOINT}/${body.stocktakeId}/complete`,
    );

    return response;
  },

  update: async (body: IStockTakeUpdateRequest) => {
    const response = await apiService.put<IStockTakeUpdateResponse>(
      `${BASE_ENDPOINT}/${body.stocktakeId}`,
      body,
    );

    return response;
  },

  updateDetail: async (body: IStockTakeDetailUpdateRequest) => {
    const response = await apiService.put<IStockTakeDetailUpdateResponse>(
      `${BASE_ENDPOINT}/details/${body.detailId}`,
      body,
    );

    return response;
  },
};
