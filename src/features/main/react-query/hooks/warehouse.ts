import { useQuery } from '@tanstack/react-query';
import { warehouseKeys } from '../query-keys';
import type {
  IBaseListRequest,
  IWarehouseByProductIdRequest,
  IWarehouseByProductUnitIdRequest,
  IWarehouseStockByProductUnitIdRequest,
} from '@/dtos';
import { warehouseApi } from '@/api';

export const useWarehouseList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: warehouseKeys.list(filters),
    queryFn: async () => await warehouseApi.list(filters),
  });
};

export const useWarehouseTransactions = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: warehouseKeys.transaction(filters),
    queryFn: async () => await warehouseApi.transaction(filters),
  });
};

export const useWarehouseTransactionsByProductId = (
  body: IWarehouseByProductIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.byProductId(body.productId),
    queryFn: async () => await warehouseApi.byProductId(body),
  });
};

export const useWarehouseTransactionByProductUnitId = (
  body: IWarehouseByProductUnitIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.transactionByProductUnitId(body.productUnitId),
    queryFn: async () => await warehouseApi.transactionByProductUnitId(body),
  });
};

export const useWarehouseStockByProductUnitId = (
  body: IWarehouseStockByProductUnitIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.stockByProductUnitId(body.productUnitId),
    queryFn: async () => await warehouseApi.stockByProductUnitId(body),
  });
};
