import {
  IProvincesByIdRequest,
  IProvincesListRequest,
  IWardsByIdRequest,
  IWardsListRequest,
} from '@/dtos';

export const addressKeys = {
  all: ['address'] as const,
  listProvinces: () => [...addressKeys.all, 'province'] as const,
  listProvince: (filters: IProvincesListRequest) =>
    [...addressKeys.listProvinces(), { filters }] as const,
  provinceByIds: () => [...addressKeys.all, 'provinceById'] as const,
  provinceById: (filters: IProvincesByIdRequest) =>
    [...addressKeys.provinceByIds(), { filters }] as const,
  listWards: () => [...addressKeys.all, 'wards'] as const,
  listWard: (filters: IWardsListRequest) =>
    [...addressKeys.listWards(), { filters }] as const,
  wardByIds: () => [...addressKeys.all, 'wardById'] as const,
  wardById: (filters: IWardsByIdRequest) =>
    [...addressKeys.wardByIds(), { filters }] as const,
};
