import { useMutation, useQuery } from '@tanstack/react-query';
import { stockTakeKeys } from '../query-keys';
import type { IBaseListRequest, IStockTakeByIdRequest } from '@/dtos';
import { stockTakeApi } from '@/api';

export const useStockTakeList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: stockTakeKeys.list(filters),
    queryFn: async () => await stockTakeApi.list(filters),
  });
};

export const useStockTakeById = (body: IStockTakeByIdRequest) => {
  return useQuery({
    queryKey: stockTakeKeys.detail(body.stocktakeId),
    queryFn: async () => await stockTakeApi.byId(body),
  });
};

export const useStockTakeCreate = () => {
  return useMutation({
    mutationFn: stockTakeApi.create,
  });
};

export const useStockTakeRefresh = () => {
  return useMutation({
    mutationFn: stockTakeApi.refresh,
  });
};
export const useStockTakeComplete = () => {
  return useMutation({
    mutationFn: stockTakeApi.complete,
  });
};

export const useStockTakeUpdate = () => {
  return useMutation({
    mutationFn: stockTakeApi.update,
  });
};

export const useStockTakeUpdateDetail = () => {
  return useMutation({
    mutationFn: stockTakeApi.updateDetail,
  });
};
