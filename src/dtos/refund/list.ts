import type { IPageable, IResponse } from '../common';
import { Dayjs } from 'dayjs';

export interface IRefundListRequest {
  searchKeyword?: string;
  fromDate?: string | Dayjs;
  toDate?: string | Dayjs;
  employeeId?: number;
  customerId?: number;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface IRefundListResponse
  extends IResponse<
    {
      content: {
        returnId: number;
        returnCode: string;
        returnDate: string;
        invoiceNumber: string;
        customerName: string;
        customerPhone: string;
        employeeName: string;
        totalRefundAmount: number;
        reclaimedDiscountAmount: number;
        finalRefundAmount: number;
        reasonNote: string;
      }[];
    } & IPageable
  > {}
