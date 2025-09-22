import type { IResponse } from '../common';

export interface IStockTakeDeleteRequest {
  ids: number[];
}

export interface IStockTakeDeleteResponse extends IResponse<null> {}

export interface IStockTakeDeleteAllRequest {
  productId: number;
}

export interface IStockTakeDeleteAllResponse extends IResponse<null> {}
