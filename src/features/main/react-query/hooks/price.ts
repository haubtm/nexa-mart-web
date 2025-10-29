import { useMutation, useQuery } from '@tanstack/react-query';
import { priceKeys } from '../query-keys';
import type {
  IPriceByIdRequest,
  IPriceDetailByIdRequest,
  IPriceListRequest,
} from '@/dtos';
import { priceApi } from '@/api';

export const usePriceList = (filters: IPriceListRequest) => {
  return useQuery({
    queryKey: priceKeys.list(filters),
    queryFn: async () => await priceApi.list(filters),
  });
};

export const usePriceById = (body: IPriceByIdRequest) => {
  return useQuery({
    queryKey: priceKeys.detail(body.priceId),
    queryFn: async () => await priceApi.byId(body),
  });
};

export const usePriceDetailById = (body: IPriceDetailByIdRequest) => {
  return useQuery({
    queryKey: priceKeys.detail(body.priceId),
    queryFn: async () => await priceApi.detailById(body),
  });
};

export const usePriceCreate = () => {
  return useMutation({
    mutationFn: priceApi.create,
  });
};

export const usePriceDetailCreate = () => {
  return useMutation({
    mutationFn: priceApi.createDetail,
  });
};

export const usePriceUpdate = () => {
  return useMutation({
    mutationFn: priceApi.update,
  });
};

export const usePriceDelete = () => {
  return useMutation({
    mutationFn: priceApi.delete,
  });
};

export const usePriceDetailDelete = () => {
  return useMutation({
    mutationFn: priceApi.deleteDetail,
  });
};

export const usePriceActivate = () => {
  return useMutation({
    mutationFn: priceApi.active,
  });
};

export const usePricePause = () => {
  return useMutation({
    mutationFn: priceApi.pause,
  });
};
