import { useMutation, useQuery } from '@tanstack/react-query';
import { attributeKeys } from '../query-keys';
import type {
  IBaseListRequest,
  IAttributeByIdRequest,
  IAttributeValueByIdRequest,
} from '@/dtos';
import { attributeApi } from '@/api';

export const useAttributeList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: attributeKeys.list(filters),
    queryFn: async () => await attributeApi.list(filters),
  });
};

export const useAttributeValueById = (body: IAttributeValueByIdRequest) => {
  return useQuery({
    queryKey: attributeKeys.valueById(body.id),
    queryFn: async () => await attributeApi.valueById(body),
  });
};

export const useAttributeById = (body: IAttributeByIdRequest) => {
  return useQuery({
    queryKey: attributeKeys.detail(body.id),
    queryFn: async () => await attributeApi.byId(body),
  });
};

export const useAttributeCreate = () => {
  return useMutation({
    mutationFn: attributeApi.create,
  });
};

export const useAttributeUpdate = () => {
  return useMutation({
    mutationFn: attributeApi.update,
  });
};

export const useAttributeDelete = () => {
  return useMutation({
    mutationFn: attributeApi.delete,
  });
};
