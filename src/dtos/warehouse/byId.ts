import type { IPageable, IResponse } from '../common';
import type { IWarehouseResponseData } from './common';

export interface IWarehouseByProductIdRequest {
  productId: number;
}

export interface IWarehouseByProductIdResponse
  extends IResponse<IWarehouseResponseData[]> {}

export interface IWarehouseByVariantIdRequest {
  variantId: number;
  page?: number;
  size?: number;
}

export interface IWarehouseByVariantIdResponse
  extends IResponse<
    {
      content: IWarehouseResponseData[];
    } & IPageable
  > {}

export interface IWarehouseStockByVariantIdRequest {
  variantId: number;
}

export interface IWarehouseStockByVariantIdResponse extends IResponse<number> {}
