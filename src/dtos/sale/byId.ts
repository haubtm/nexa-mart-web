import { EPaymentMethod } from '@/lib';
import type { IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IOrderByIdRequest {
  orderId: number;
}

export interface IOrderByIdResponse
  extends IResponse<{
    invoiceId: number;
    invoiceStatus: 'PAID' | 'COMPLETED' | 'PENDING' | 'CANCELLED';
    paymentMethod: EPaymentMethod;
    totalAmount: number;
    amountPaid: number;
    invoiceNumber: string;
    invoiceDate: string;
    createdAt: string;
    updatedAt: string;
  }> {}

export interface IOrderByInvoiceIdRequest {
  invoiceId: number;
}

export interface IOrderByInvoiceIdResponse
  extends IResponse<IOrderResponseData> {}
