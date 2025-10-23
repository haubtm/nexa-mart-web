import { EGiftDiscountType } from '@/lib';
import type { IResponse } from '../common';

export interface IPromotionCheckRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}

interface IItemPromotion {
  lineItemId: number;
  productUnitId: number;
  unit: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  hasPromotion: boolean;
  promotionApplied?: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: string;
    discountValue: number;
    sourceLineItemId: number;
  };
}

interface IAppliedOrderPromotions {
  promotionId: string;
  promotionName: string;
  promotionDetailId: number;
  promotionSummary: string;
  discountType: EGiftDiscountType;
  discountValue: number;
}

interface IPromotionCheckResponseData {
  items: IItemPromotion[];
  summary: {
    subTotal: number;
    orderDiscount: number;
    lineItemDiscount: number;
    totalPayable: number;
  };
  appliedOrderPromotions: IAppliedOrderPromotions[];
}

export interface IPromotionCheckResponse
  extends IResponse<IPromotionCheckResponseData> {}
