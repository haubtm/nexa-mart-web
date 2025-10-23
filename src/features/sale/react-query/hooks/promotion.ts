import { useQuery } from '@tanstack/react-query';
import { promotionKeys } from '../query-keys';
import type { IPromotionCheckRequest } from '@/dtos';
import { promotionApi } from '@/api';

export const usePromotionCheck = (body: IPromotionCheckRequest) => {
  return useQuery({
    queryKey: promotionKeys.check(body),
    queryFn: async () => await promotionApi.checkPromotion(body),
  });
};
