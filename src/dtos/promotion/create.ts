import { Dayjs } from 'dayjs';
import type { IResponse } from '../common';
import type { IPromotionResponseData } from './common';
import {
  EApplyToType,
  EGiftDiscountType,
  EOrderDiscountType,
  EProductDiscountType,
  EPromotionStatus,
  EPromotionType,
} from '@/lib';

interface IPromotionDetail {
  promotionCode: string;
  usageLimit: number;
  usageCount: number;
  // Buy X Get Y
  buyProductId: number;
  buyMinQuantity: number;
  buyMinValue?: number;
  giftProductId: number;
  giftQuantity?: number;
  giftDiscountType: EGiftDiscountType;
  giftDiscountValue: number;
  giftMaxQuantity: number;
  // Order Discount
  orderDiscountType?: EOrderDiscountType;
  orderDiscountValue?: number;
  orderDiscountMaxValue?: number;
  orderMinTotalValue?: number;
  orderMinTotalQuantity?: number;
  // Product Discount
  productDiscountType?: EProductDiscountType;
  productDiscountValue?: number;
  applyToType?: EApplyToType;
  applyToProductId?: number;
  productMinOrderValue?: number;
  productMinPromotionValue?: number;
  productMinPromotionQuantity?: number;
}

export type IPromotionDetailCreateRequest = {
  lineId: number;
  detail?: {};
} & IPromotionDetail;

export interface IPromotionDetailCreateResponse
  extends IResponse<
    IPromotionResponseData['promotionLines'][number]['details']
  > {}

export interface IPromotionLineCreateRequest {
  headerId: number;
  lineName: string;
  promotionType: EPromotionType;
  description?: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string;
  status?: EPromotionStatus;
}

export interface IPromotionLineCreateResponse
  extends IResponse<IPromotionResponseData['promotionLines'][number]> {}

export interface IPromotionHeaderCreateRequest {
  promotionName: string;
  description?: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string;
  status?: EPromotionStatus;
}

export interface IPromotionHeaderCreateResponse
  extends IResponse<IPromotionResponseData> {}
