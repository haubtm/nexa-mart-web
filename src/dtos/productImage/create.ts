import type { IResponse } from '../common';
import type { IProductImageResponseData } from './common';

export interface IProductImageCreateRequest {
  productId: number;
  imageFiles: File[];
}

export interface IProductImageCreateResponse
  extends IResponse<IProductImageResponseData> {}
