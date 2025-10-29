import type { IResponse } from '../common';
import type { IProductResponseData, IUnitResponseData } from './common';

export interface IUnit {
  id?: number;
  unitName: string;
  conversionValue: number;
  isBaseUnit: boolean;
  barcode?: string;
}

export interface IProductCreateRequest {
  name: string;
  code: string;
  description?: string;
  brandId?: number;
  categoryId?: number;
  isActive?: boolean;
  units: IUnit[];
}

export interface IProductCreateResponse
  extends IResponse<IProductResponseData> {}

export interface IProductAddUnitsRequest {
  productId: number;
  unit: {
    unitName: string;
    conversionValue: number;
    isBaseUnit: boolean;
    code: string;
    barcode: string;
  };
}

export interface IProductAddUnitsResponse
  extends IResponse<IUnitResponseData> {}
