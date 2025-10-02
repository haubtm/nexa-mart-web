import { useMutation, useQuery } from '@tanstack/react-query';
import { promotionKeys } from '../query-keys';
import type {
  IPromotionByIdRequest,
  IPromotionLineByLineIdRequest,
  IPromotionLinesByHeaderIdRequest,
  IPromotionListRequest,
} from '@/dtos';
import { promotionApi } from '@/api';

export const usePromotionList = (filters: IPromotionListRequest) => {
  return useQuery({
    queryKey: promotionKeys.list(filters),
    queryFn: async () => await promotionApi.list(filters),
  });
};

export const usePromotionById = (body: IPromotionByIdRequest) => {
  return useQuery({
    queryKey: promotionKeys.byId(body.promotionId),
    queryFn: async () => await promotionApi.byId(body),
  });
};

export const usePromotionByLineId = (body: IPromotionLineByLineIdRequest) => {
  return useQuery({
    queryKey: promotionKeys.byLineId(body.lineId),
    queryFn: async () => await promotionApi.byLineId(body),
  });
};

export const usePromotionByHeaderId = (
  body: IPromotionLinesByHeaderIdRequest,
) => {
  return useQuery({
    queryKey: promotionKeys.byHeaderId(body.promotionId),
    queryFn: async () => await promotionApi.byHeaderId(body),
  });
};

export const usePromotionHeaderCreate = () => {
  return useMutation({
    mutationFn: promotionApi.createPromotionHeader,
  });
};

export const usePromotionLineCreate = () => {
  return useMutation({
    mutationFn: promotionApi.createPromotionLine,
  });
};

export const usePromotionHeaderUpdate = () => {
  return useMutation({
    mutationFn: promotionApi.updateProductHeader,
  });
};

export const usePromotionLineUpdate = () => {
  return useMutation({
    mutationFn: promotionApi.updateProductLine,
  });
};

export const usePromotionDelete = () => {
  return useMutation({
    mutationFn: promotionApi.delete,
  });
};

export const usePromotionLineDelete = () => {
  return useMutation({
    mutationFn: promotionApi.deleteLine,
  });
};
