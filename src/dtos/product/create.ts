import type { IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IUnit {
  unit: string;
  conversionValue: number;
  barcode: string;
  variantCode: string;
  isBaseUnit: boolean;
}

export interface IAttribute {
  attributeId: number;
  value: string;
}

export interface IVariant {
  attributes: IAttribute[];
  units: IUnit[];
}

export interface IProductCreateRequest {
  name: string;
  categoryId?: number;
  brandId?: number;
  description?: string;
  allowSale?: boolean;
  variants?: IVariant[];
}

export interface IProductCreateResponse
  extends IResponse<IProductResponseData> {}
