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
  // Buy X Get Y
  buyCategoryId?: number;
  buyMinValue?: number;
  buyProductId: number;
  buyMinQuantity: number;
  giftProductId: number;
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
  applyToCategoryId?: number;
  applyToProductId?: number;
  productMinOrderValue?: number;
  productMinPromotionValue?: number;
  productMinPromotionQuantity?: number;
}

export interface IPromotionLineCreateRequest {
  headerId: number;
  promotionCode: string;
  promotionType: EPromotionType;
  description?: string;
  startDate: Dayjs | string;
  endDate: Dayjs | string;
  status?: EPromotionStatus;
  maxUsagePerCustomer?: number;
  maxUsageTotal?: number;
  detail: IPromotionDetail[];
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
