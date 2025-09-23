import type { IBaseListRequest } from '@/dtos';

export const warehouseKeys = {
  all: ['warehouse'] as const,
  byProductIds: () => [...warehouseKeys.all, 'byProductIds'] as const,
  byProductId: (id: number) => [...warehouseKeys.byProductIds(), id] as const,
  transactions: () => [...warehouseKeys.all, 'transactions'] as const,
  transaction: (filters: IBaseListRequest) =>
    [...warehouseKeys.transactions(), { filters }] as const,
  transactionByVariantId: (variantId: number) =>
    [...warehouseKeys.transactions(), 'byVariantId', variantId] as const,
  stockByVariantId: (variantId: number) =>
    [...warehouseKeys.all, 'stockByVariantId', variantId] as const,
};
