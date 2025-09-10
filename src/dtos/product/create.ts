import type { IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IBaseUnit {
  unit: string;
  basePrice: number;
  cost: number;
  barcode: string;
}

export interface IAdditionalUnits {
  unit: string;
  basePrice: number;
  conversionValue: number;
  barcode: string;
}

export interface IAttribute {
  attributeId: number;
  value: string;
}

export interface IInventory {
  minQuantity: number;
  maxQuantity: number;
  onHand: number;
}

export interface IProductCreateRequest {
  name: string;
  categoryId: number;
  productType: number;
  baseUnit: IBaseUnit;
  additionalUnits?: IAdditionalUnits[];
  attributes?: IAttribute[];
  inventory: IInventory;
  allowsSale: boolean;
  description: string;
}

export interface IProductCreateResponse
  extends IResponse<IProductResponseData> {}
