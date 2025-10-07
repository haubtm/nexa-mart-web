import type { IResponse } from '../common';
import type { IPromotionResponseData } from './common';
import {
  IPromotionDetailCreateRequest,
  IPromotionHeaderCreateRequest,
  IPromotionLineCreateRequest,
} from './create';

export interface IPromotionHeaderUpdateRequest
  extends Partial<IPromotionHeaderCreateRequest> {
  promotionId: number;
}

export interface IPromotionHeaderUpdateResponse
  extends IResponse<IPromotionResponseData> {}

export interface IPromotionLineUpdateRequest
  extends Partial<IPromotionLineCreateRequest> {
  lineId: number;
}

export interface IPromotionLineUpdateResponse
  extends IResponse<IPromotionResponseData['promotionLines'][number]> {}

export interface IPromotionDetailUpdateRequest
  extends Partial<IPromotionDetailCreateRequest> {
  detailId: number;
}

export interface IPromotionDetailUpdateResponse
  extends IResponse<
    IPromotionResponseData['promotionLines'][number]['details']
  > {}
