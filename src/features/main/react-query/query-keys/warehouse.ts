import type { IBaseListRequest } from '@/dtos';

export const warehouseKeys = {
  all: ['warehouse'] as const,
  lists: () => [...warehouseKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...warehouseKeys.lists(), { filters }] as const,
  byProductIds: () => [...warehouseKeys.all, 'byProductIds'] as const,
  byProductId: (id: number) => [...warehouseKeys.byProductIds(), id] as const,
  transactions: () => [...warehouseKeys.all, 'transactions'] as const,
  transaction: (filters: IBaseListRequest) =>
    [...warehouseKeys.transactions(), { filters }] as const,
  transactionByProductUnitId: (productUnitId: number) =>
    [
      ...warehouseKeys.transactions(),
      'byProductUnitId',
      productUnitId,
    ] as const,
  stockByProductUnitId: (productUnitId: number) =>
    [...warehouseKeys.all, 'stockByProductUnitId', productUnitId] as const,
};
