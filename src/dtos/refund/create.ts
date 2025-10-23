import type { IResponse } from '../common';

export type IRefundCreateRequest = {
  invoiceId: number;
  refundLineItems: {
    lineItemId: number;
    quantity: number;
  }[];
  reasonNote: string;
};

export interface IRefundCreateResponse
  extends IResponse<{
    returnId: number;
    returnCode: string;
    finalRefundAmount: number;
    reclaimedDiscountAmount: number;
  }> {}

export type IRefundCalculateRequest = {
  invoiceId: number;
  refundLineItems: {
    lineItemId: number;
    quantity: number;
  }[];
  reasonNote: string;
};

export interface IRefundCalculateResponse
  extends IResponse<{
    maximumRefundable: number;
    refundLineItems: {
      lineItemId: number;
      quantity: number;
      price: number;
      subtotal: number;
      originalPrice: number;
      discountedPrice: number;
      discountedSubtotal: number;
      maximumRefundableQuantity: number;
      totalCartDiscountAmount: number;
    }[];
    transaction: {
      invoiceId: number;
      amount: number;
      maximumRefundable: number;
    };
  }> {}
