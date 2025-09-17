import type {
  IBaseListRequest,
  IInventoryHistoryResponse,
  IInventoryUpdateRequest,
  IInventoryUpdateResponse,
} from '@/dtos';
import { apiService } from '../axiosService';

const BASE_ENDPOINT = '/inventory';

export const inventoryApi = {
  history: async (body: IBaseListRequest) => {
    const url = `${BASE_ENDPOINT}/history`;
    const response = await apiService.get<IInventoryHistoryResponse>(url, {
      params: body,
    });

    return response;
  },

  update: async (body: IInventoryUpdateRequest) => {
    const response = await apiService.put<IInventoryUpdateResponse>(
      `${BASE_ENDPOINT}/update`,
      body,
    );

    return response;
  },
};
