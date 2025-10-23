import type { IResponse } from '../common';
import { IRefundDetail } from './common';

export interface IRefundByIdRequest {
  returnId?: number;
}

export interface IRefundResponseData {
  returnId: number;
  returnCode: string;
  returnDate: string;
  invoiceNumber: string;
  invoiceId: number;
  customer: string;
  employee: {
    employeeId: number;
    name: string;
    email: string;
  };
  totalRefundAmount: number;
  reclaimedDiscountAmount: number;
  finalRefundAmount: number;
  reasonNote: string;
  returnDetails: IRefundDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface IRefundByIdResponse extends IResponse<IRefundResponseData> {}

export interface IRefundCheckQuantityByIdRequest {
  invoiceId?: number;
}

export interface IRefundCheckQuantityByIdResponse
  extends IResponse<{
    invoiceId: number;
    invoiceNumber: string;
    invoiceDate: string;
    customerName: string;
    customerPhone: string;
    employeeName: string;
    lineItems: {
      lineItemId: number;
      productName: string;
      unitName: string;
      originalQuantity: number;
      returnedQuantity: number;
      availableQuantity: number;
      unitPrice: number;
      priceAfterDiscount: number;
      isFullyReturned: boolean;
    }[];
    totalOriginalQuantity: number;
    totalReturnedQuantity: number;
    totalAvailableQuantity: number;
  }> {}
