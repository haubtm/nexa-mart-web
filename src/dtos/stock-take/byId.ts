import type { IResponse } from '../common';
import type { IStockTakeResponseData } from './common';

export interface IStockTakeByIdRequest {
  stocktakeId: number;
}

export interface IStockTakeByIdResponse
  extends IResponse<IStockTakeResponseData> {}
