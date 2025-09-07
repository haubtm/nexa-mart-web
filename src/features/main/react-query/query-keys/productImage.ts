export const productImageKeys = {
  all: ['productImage'] as const,
  details: () => [...productImageKeys.all, 'detail'] as const,
  detail: (id: number) => [...productImageKeys.details(), id] as const,
};
