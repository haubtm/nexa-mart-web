import type { IResponse } from '../common';
import type { IProductResponseData, IUnitResponseData } from './common';

export interface IProductUpdateRequest {
  id: number;
  name?: string;
  description?: string;
  brandId?: number;
  categoryId?: number;
  isActive?: boolean;
}

export interface IProductUpdateResponse
  extends IResponse<IProductResponseData> {}

export interface IProductUnitUpdateRequest {
  productId: number;
  unitId: number;
  unitName?: string;
  conversionValue?: number;
  isBaseUnit?: boolean;
  code?: string;
  barcode?: string;
  isActive?: boolean;
}

export interface IProductUnitUpdateResponse
  extends IResponse<IUnitResponseData> {}
