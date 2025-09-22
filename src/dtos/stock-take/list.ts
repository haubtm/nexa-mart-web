import type { IPageable, IResponse } from '../common';
import type { IStockTakeResponseData } from './common';

export interface IStockTakeListResponse
  extends IResponse<
    {
      content: IStockTakeResponseData[];
    } & IPageable
  > {}
