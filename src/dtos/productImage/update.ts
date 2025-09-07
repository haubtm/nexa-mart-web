import type { IResponse } from '../common';
import type { IProductImageResponseData } from './common';

export interface IProductImageSortOrderUpdateRequest {
  productId: number;
  sortOrder: number;
}

export interface IProductImageSortOrderUpdateResponse
  extends IResponse<IProductImageResponseData> {}

export interface IProductImageAltUpdateRequest {
  imageId: number;
  imageAlt: string;
}

export interface IProductImageAltUpdateResponse
  extends IResponse<IProductImageResponseData> {}
