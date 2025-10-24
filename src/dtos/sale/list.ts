import { EInvoiceStatus } from '@/lib';
import type { IResponse } from '../common';
import type { IOrderResponseData } from './common';
interface IPageable {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}

export interface IOrderListRequest {
  searchKeyword?: string;
  employeeId?: number;
  customerId?: number;
  productUnitId?: number;
  fromDate?: string;
  toDate?: string;
  status?: EInvoiceStatus;
  pageNumber?: number;
  pageSize?: number;
}

export interface IOrderListResponse
  extends IResponse<
    {
      invoices: IOrderResponseData[];
    } & IPageable
  > {}
