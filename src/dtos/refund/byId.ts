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
