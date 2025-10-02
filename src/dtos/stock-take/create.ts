import { StockTakeStatus } from '@/lib';
import type { IResponse } from '../common';
import type { IStockTakeResponseData } from './common';

export interface IStockTakeCreateRequest {
  stocktakeCode: string;
  notes?: string;
  status: StockTakeStatus;
  stocktakeDetails: {
    productUnitId: number;
    quantityCounted: number;
    reason?: string;
  }[];
}

export interface IStockTakeCreateResponse
  extends IResponse<IStockTakeResponseData> {}
