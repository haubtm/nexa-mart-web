export const warehouseKeys = {
  all: ['warehouse'] as const,
  stockByProductUnitIds: () =>
    [...warehouseKeys.all, 'stockByProductUnitIds'] as const,
  stockByProductUnitId: (productUnitId: number) =>
    [...warehouseKeys.stockByProductUnitIds(), productUnitId] as const,
};
