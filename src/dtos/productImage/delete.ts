import type { IResponse } from '../common';

export interface IProductImageDeleteRequest {
  ids: number[];
}

export interface IProductImageDeleteResponse extends IResponse<null> {}

export interface IProductImageDeleteAllRequest {
  productId: number;
}

export interface IProductImageDeleteAllResponse extends IResponse<null> {}
