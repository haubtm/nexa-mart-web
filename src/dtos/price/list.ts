import { ESortDirection } from '@/lib';
import type { IPageable, IResponse } from '../common';
import type { IPriceResponseData } from './common';

export interface IPriceListRequest {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  startDateFrom?: string;
  startDateTo?: string;
  endDateFrom?: string;
  endDateTo?: string;
  sortBy?: string;
  sortDirection?: ESortDirection | any;
  includeDetails?: boolean;
  createdBy?: number;
  createdFrom?: string;
  createdTo?: string;
}

export interface IPriceListResponse
  extends IResponse<
    {
      content: IPriceResponseData[];
    } & IPageable
  > {}
