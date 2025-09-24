import type { IResponse } from '../common';

export interface IPriceDeleteRequest {
  ids: number[];
}

export interface IPriceDeleteResponse extends IResponse<null> {}

export interface IPriceDetailDeleteRequest {
  priceId: number;
  priceDetailIds: number[];
}

export interface IPriceDetailDeleteResponse extends IResponse<null> {}
