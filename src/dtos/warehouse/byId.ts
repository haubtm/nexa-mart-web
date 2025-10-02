import type { IPageable, IResponse } from '../common';
import type { IWarehouseResponseData } from './common';

export interface IWarehouseByProductIdRequest {
  productId: number;
}

export interface IWarehouseByProductIdResponse
  extends IResponse<IWarehouseResponseData[]> {}

export interface IWarehouseByProductUnitIdRequest {
  productUnitId: number;
  page?: number;
  size?: number;
}

export interface IWarehouseByProductUnitIdResponse
  extends IResponse<
    {
      content: IWarehouseResponseData[];
    } & IPageable
  > {}

export interface IWarehouseStockByProductUnitIdRequest {
  productUnitId: number;
}

export interface IWarehouseStockByProductUnitIdResponse
  extends IResponse<number> {}
