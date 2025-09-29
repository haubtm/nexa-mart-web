import type { IResponse } from '../common';
import type { IProductImageResponseData } from './common';

export interface IProductImageByIdRequest {
  productId: number;
}

export interface IProductImageByIdResponse
  extends IResponse<IProductImageResponseData[]> {}
