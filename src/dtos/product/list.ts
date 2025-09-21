import type { IPageable, IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IProductListResponse
  extends IResponse<
    {
      content: IProductResponseData[];
    } & IPageable
  > {}
