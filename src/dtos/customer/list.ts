import type { IPageable, IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface ICustomerListResponse
  extends IResponse<
    {
      content: ICustomerResponseData[];
    } & IPageable
  > {}
