import { useMutation, useQuery } from '@tanstack/react-query';
import { importsKeys } from '../query-keys';
import type {
  IBaseListRequest,
  IImportsByIdRequest,
  IImportsBySupplierIdRequest,
} from '@/dtos';
import { importsApi } from '@/api';

export const useImportsList = (filters: IBaseListRequest) => {
  return useQuery({
    queryKey: importsKeys.list(filters),
    queryFn: async () => await importsApi.list(filters),
  });
};

export const useImportsById = (body: IImportsByIdRequest) => {
  return useQuery({
    queryKey: importsKeys.detail(body.id),
    queryFn: async () => await importsApi.byId(body),
  });
};

export const useImportsBySupplierId = (body: IImportsBySupplierIdRequest) => {
  return useQuery({
    queryKey: importsKeys.detail(body.supplierId),
    queryFn: async () => await importsApi.bySupplierId(body),
  });
};

export const useImportsCreate = () => {
  return useMutation({
    mutationFn: importsApi.create,
  });
};
