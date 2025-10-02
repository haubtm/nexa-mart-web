import type { IBaseListRequest } from '@/dtos';

export const promotionKeys = {
  all: ['promotion'] as const,
  lists: () => [...promotionKeys.all, 'list'] as const,
  list: (filters: IBaseListRequest) =>
    [...promotionKeys.lists(), { filters }] as const,
  byIds: () => [...promotionKeys.all, 'byId'] as const,
  byId: (id: number) => [...promotionKeys.byIds(), id] as const,
  byHeaderIds: () => [...promotionKeys.all, 'byHeaderId'] as const,
  byHeaderId: (id: number) => [...promotionKeys.byHeaderIds(), id] as const,
  byLineIds: () => [...promotionKeys.all, 'byLineId'] as const,
  byLineId: (id: number) => [...promotionKeys.byLineIds(), id] as const,
};
