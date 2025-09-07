import type { IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IProductByIdRequest {
  id: number;
}

export interface IProductByIdResponse extends IResponse<IProductResponseData> {}

export interface IProductByCategoryIdRequest {
  categoryId: number;
}

export interface IProductByCategoryIdResponse
  extends IResponse<IProductResponseData[]> {}
