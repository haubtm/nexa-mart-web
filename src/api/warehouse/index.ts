import type {
  IBaseListRequest,
  IWarehouseByProductIdRequest,
  IWarehouseByProductIdResponse,
  IWarehouseByProductUnitIdRequest,
  IWarehouseByProductUnitIdResponse,
  IWarehouseListResponse,
  IWarehouseStockByProductUnitIdRequest,
  IWarehouseStockByProductUnitIdResponse,
  IWarehouseTransactionResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/warehouse';

export const warehouseApi = {
  list: async (body: IBaseListRequest) => {
    const response = await apiService.get<IWarehouseListResponse>(
      `${BASE_ENDPOINT}?page=${body.page}&size=${body.limit}`,
    );
    return response;
  },

  byProductId: async (body: IWarehouseByProductIdRequest) => {
    const response = await apiService.post<IWarehouseByProductIdResponse>(
      `${BASE_ENDPOINT}/product/${body.productId}`,
      body,
    );

    return response;
  },

  transaction: async (body: IBaseListRequest) => {
    const response = await apiService.get<IWarehouseTransactionResponse>(
      `${BASE_ENDPOINT}/transactions?page=${body.page}&size=${body.limit}`,
    );

    return response;
  },

  transactionByProductUnitId: async (
    body: IWarehouseByProductUnitIdRequest,
  ) => {
    const response = await apiService.get<IWarehouseByProductUnitIdResponse>(
      `${BASE_ENDPOINT}/transactions/product-unit/${body.productUnitId}`,
    );

    return response;
  },

  stockByProductUnitId: async (body: IWarehouseStockByProductUnitIdRequest) => {
    const response =
      await apiService.get<IWarehouseStockByProductUnitIdResponse>(
        `${BASE_ENDPOINT}/product-unit/${body.productUnitId}/stock`,
      );

    return response;
  },
};
