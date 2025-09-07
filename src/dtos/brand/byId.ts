import type { IResponse } from '../common';
import type { IBrandResponseData } from './common';

export interface IBrandByIdRequest {
  brandId: number;
}

export interface IBrandByIdResponse extends IResponse<IBrandResponseData> {}
