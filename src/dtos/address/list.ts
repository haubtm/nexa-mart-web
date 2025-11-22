import { EDivisionType } from '@/lib';

export interface IProvincesListRequest {
  search?: string;
}

export interface IProvinceItem {
  name: string;
  code: number;
  division_type: EDivisionType;
  codename: string;
  phone_code: number;
  wards: IWardItem[];
}

export type IProvincesListResponse = IProvinceItem[];

export interface IWardsListRequest {
  search?: string;
  province: number;
}

export interface IWardItem {
  name: string;
  code: number;
  division_type: EDivisionType;
  codename: string;
  province_code: number;
}

export type IWardsListResponse = IWardItem[];
