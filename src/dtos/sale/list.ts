import { EPaymentMethod } from '@/lib';
import type { IResponse } from '../common';
import type { IOrderResponseData } from './common';
interface IPageable {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IOrderListRequest {
  invoiceNumber?: string;
  customerName?: string;
  fromDate?: string;
  toDate?: string;
  status?: EPaymentMethod;
  pageNumber?: number;
  pageSize?: number;
}

export interface IOrderListResponse
  extends IResponse<
    {
      invoices: IOrderResponseData[];
    } & IPageable
  > {}
