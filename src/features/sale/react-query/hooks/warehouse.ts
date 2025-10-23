import { useQuery } from '@tanstack/react-query';
import { warehouseKeys } from '../query-keys';
import type { IWarehouseStockByProductUnitIdRequest } from '@/dtos';
import { warehouseApi } from '@/api';

export const useWarehouseStockByProductUnitId = (
  body: IWarehouseStockByProductUnitIdRequest,
) => {
  return useQuery({
    queryKey: warehouseKeys.stockByProductUnitId(body.productUnitId),
    queryFn: async () => await warehouseApi.stockByProductUnitId(body),
  });
};
