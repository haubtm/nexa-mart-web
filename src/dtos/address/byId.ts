import { EDivisionType } from '@/lib';

export interface IProvincesByIdRequest {
  id: number;
}

export interface IProvincesByIdResponse {
  name: string;
  code: number;
  division_type: EDivisionType;
  codename: string;
  phone_code: number;
}

export interface IWardsByIdRequest {
  id: number;
}

export interface IWardsByIdResponse {
  name: string;
  code: number;
  division_type: EDivisionType;
  codename: string;
  province_code: number;
}
