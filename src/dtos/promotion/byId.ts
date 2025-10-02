import { EPromotionType } from '@/lib';
import type { IResponse } from '../common';
import type { IPromotionResponseData } from './common';

export interface IPromotionByIdRequest {
  promotionId: number;
}

export interface IPromotionByIdResponse
  extends IResponse<IPromotionResponseData> {}

export interface IPromotionLinesByHeaderIdRequest {
  promotionId: number;
  promotionType: EPromotionType;
  startDateFrom: string;
  startDateTo: string;
  endDateFrom: string;
  endDateTo: string;
}

export interface IPromotionLinesByHeaderIdResponse
  extends IResponse<IPromotionResponseData['promotionLines']> {}

export interface IPromotionLineByLineIdRequest {
  lineId: number;
}

export interface IPromotionLineByLineIdResponse
  extends IResponse<IPromotionResponseData['promotionLines'][number]> {}
