import type { IPageable, IResponse } from '../common';
import type { IWarehouseResponseData } from './common';

export interface IWarehouseListResponse
  extends IResponse<
    {
      content: IWarehouseResponseData[];
    } & IPageable
  > {}
