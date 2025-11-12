import type { IPageable, IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface ICustomerListRequest {
  page: number;
  limit: number;
  searchTerm?: string;
}
export interface ICustomerListResponse
  extends IResponse<
    {
      content: ICustomerResponseData[];
    } & IPageable
  > {}
