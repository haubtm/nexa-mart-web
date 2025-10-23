import { EPaymentMethod } from '@/lib';
import type { IResponse } from '../common';

export interface IOrderByIdRequest {
  orderId: number;
}

export interface IOrderByIdResponse
  extends IResponse<{
    orderId: number;
    status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
    paymentMethod: EPaymentMethod;
    totalAmount: number;
    amountPaid: number;
    invoiceNumber: string;
    invoiceDate: string;
    createdAt: string;
    updatedAt: string;
  }> {}
