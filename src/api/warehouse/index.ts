import type {
  IBaseListRequest,
  IWarehouseByProductIdRequest,
  IWarehouseByProductIdResponse,
  IWarehouseByVariantIdRequest,
  IWarehouseByVariantIdResponse,
  IWarehouseStockByVariantIdRequest,
  IWarehouseStockByVariantIdResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/warehouses';

export const warehouseApi = {
  byProductId: async (body: IWarehouseByProductIdRequest) => {
    const response = await apiService.post<IWarehouseByProductIdResponse>(
      `${BASE_ENDPOINT}/product/${body.productId}`,
      body,
    );

    return response;
  },

  transaction: async (body: IBaseListRequest) => {
    const response = await apiService.get<IWarehouseByVariantIdResponse>(
      `${BASE_ENDPOINT}/transactions/variant/?page=${body.page}&size=${body.limit}`,
    );

    return response;
  },

  transactionByVariantId: async (body: IWarehouseByVariantIdRequest) => {
    const response = await apiService.get<IWarehouseByVariantIdResponse>(
      `${BASE_ENDPOINT}/transactions/variant/${body.variantId}`,
    );

    return response;
  },

  stockByVariantId: async (body: IWarehouseStockByVariantIdRequest) => {
    const response = await apiService.get<IWarehouseStockByVariantIdResponse>(
      `${BASE_ENDPOINT}/warehouse/variant/${body.variantId}/stock`,
    );

    return response;
  },
};
