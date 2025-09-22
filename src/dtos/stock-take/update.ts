import { StockTakeStatus } from '@/lib';
import type { IResponse } from '../common';
import type { IStockTakeDetail, IStockTakeResponseData } from './common';

export interface IStockTakeUpdateRequest {
  stocktakeId: number;
  status: StockTakeStatus;
  notes?: string;
  stocktakeDetails: {
    stocktakeDetailId: number;
    quantityCounted: number;
    reason?: string;
  }[];
}

export interface IStockTakeUpdateResponse
  extends IResponse<IStockTakeResponseData> {}

export interface IStockTakeDetailUpdateRequest {
  detailId: number;
  quantityCounted?: number;
  reason?: string;
}

export interface IStockTakeDetailUpdateResponse
  extends IResponse<IStockTakeDetail> {}

export interface IStockTakeCompleteUpdateRequest {
  stocktakeId: number;
}

export interface IStockTakeDetailUpdateResponse
  extends IResponse<IStockTakeDetail> {}

export interface IStockTakeRefreshUpdateRequest {
  stocktakeId: number;
}

export interface IStockTakeRefreshUpdateResponse
  extends IResponse<IStockTakeDetail> {}
