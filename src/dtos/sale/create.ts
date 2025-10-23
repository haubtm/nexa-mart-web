import { EGiftDiscountType, EPaymentMethod } from '@/lib';
import type { IResponse } from '../common';
import type { ISaleResponseData } from './common';

export interface ISaleCreateRequest {
  employeeId: number;
  customerId?: number;
  paymentMethod: EPaymentMethod;
  amountPaid: number;
  note?: string;
  items: {
    productUnitId: number;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    promotionApplied: {
      promotionId: string;
      promotionName: string;
      promotionDetailId: number;
      promotionSummary: string;
      discountType: EGiftDiscountType;
      discountValue: number;
      sourceLineItemId: number;
    };
  }[];
  appliedOrderPromotions: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: EGiftDiscountType;
    discountValue: number;
  }[];
}

export interface ISaleCreateResponse extends IResponse<ISaleResponseData> {}
