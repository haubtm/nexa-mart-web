import type { IPageable, IResponse } from '../common';
import type {
  IWarehouseResponseData,
  IWarehouseTransactionResponseData,
} from './common';

export interface IWarehouseListResponse
  extends IResponse<
    {
      content: IWarehouseResponseData[];
    } & IPageable
  > {}

export interface IWarehouseTransactionResponse
  extends IResponse<
    { content: IWarehouseTransactionResponseData[] } & IPageable
  > {}
