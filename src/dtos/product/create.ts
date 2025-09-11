import type { IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IUnit {
  unit: string;
  basePrice: number;
  cost: number;
  onHand: number;
  conversionValue: number;
}

export interface IAttribute {
  attributeId: number;
  value: string;
}

export interface IVariant {
  sku: string;
  attributes: IAttribute[];
  units: IUnit[];
}

export interface IProductCreateRequest {
  name: string;
  categoryId: number;
  brandId: number;
  baseUnit?: IUnit;
  productType: number;
  variants?: IVariant[];
  description: string;
}

export interface IProductCreateResponse
  extends IResponse<IProductResponseData> {}
