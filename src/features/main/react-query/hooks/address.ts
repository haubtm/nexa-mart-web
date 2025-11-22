import { useQuery } from '@tanstack/react-query';
import { addressKeys } from '../query-keys';
import type {
  IProvincesByIdRequest,
  IProvincesListRequest,
  IWardsByIdRequest,
  IWardsListRequest,
} from '@/dtos';
import { addressApi } from '@/api';

export const useAddressProvinceList = (filters: IProvincesListRequest) => {
  return useQuery({
    queryKey: addressKeys.listProvince(filters),
    queryFn: async () => await addressApi.listProvinces(filters),
  });
};

export const useAddressProvinceById = (filters: IProvincesByIdRequest) => {
  return useQuery({
    queryKey: addressKeys.provinceById(filters),
    queryFn: async () => await addressApi.provinceById(filters),
    // enabled: !!filters.id && filters.id > 0,
  });
};

export const useAddressWardList = (filters: IWardsListRequest) => {
  return useQuery({
    queryKey: addressKeys.listWard(filters),
    queryFn: async () => await addressApi.listWards(filters),
    enabled: !!filters.province,
  });
};

export const useAddressWardById = (filters: IWardsByIdRequest) => {
  return useQuery({
    queryKey: addressKeys.wardById(filters),
    queryFn: async () => await addressApi.wardById(filters),
    // enabled: !!filters.id && filters.id > 0,
  });
};
