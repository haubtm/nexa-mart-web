import type { IResponse } from '../common';

export interface IProductDeleteRequest {
  ids: number[];
}

export interface IProductDeleteResponse extends IResponse<null> {}

export interface IProductUnitDeleteRequest {
  productId: number;
  unitId: number;
}

export interface IProductUnitDeleteResponse extends IResponse<string> {}
