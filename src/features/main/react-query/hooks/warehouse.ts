import { useQuery } from '@tanstack/react-query';
import { warehouseKeys } from '../query-keys';
import type {
  IBaseListRequest,
  IWarehouseByProductIdRequest,
  IWarehouseByVariantIdRequest,
  IWarehouseStockByVariantIdRequest,
} from '@/dtos';
import { warehouseApi } from '@/api';

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

export const useWarehouseTransactionByVariants = (
  body: IWarehouseByVariantIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.transactionByVariantId(body.variantId),
    queryFn: async () => await warehouseApi.transactionByVariantId(body),
  });
};

export const useWarehouseStockByVariantId = (
  body: IWarehouseStockByVariantIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.stockByVariantId(body.variantId),
    queryFn: async () => await warehouseApi.stockByVariantId(body),
  });
};
