export const productUnitImageKeys = {
  all: ['productUnitImage'] as const,
  byIds: () => [...productUnitImageKeys.all, 'byId'] as const,
  byId: (id: number) => [...productUnitImageKeys.byIds(), id] as const,
};
