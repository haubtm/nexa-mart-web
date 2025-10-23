import type { IPromotionCheckRequest } from '@/dtos';

export const promotionKeys = {
  all: ['promotion'] as const,
  checks: () => [...promotionKeys.all, 'check'] as const,
  check: (body: IPromotionCheckRequest) =>
    [...promotionKeys.checks(), { body }] as const,
};
