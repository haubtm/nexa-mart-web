import type { IResponse } from '../common';

export interface IPromotionDeleteRequest {
  ids: number[];
}

export interface IPromotionDeleteResponse extends IResponse<null> {}

export interface IPromotionLineDeleteRequest {
  ids: number[];
}

export interface IPromotionLineDeleteResponse extends IResponse<null> {}

export interface IPromotionDetailDeleteRequest {
  ids: number[];
}

export interface IPromotionDetailDeleteResponse extends IResponse<null> {}
