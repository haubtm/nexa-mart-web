import type { IResponse } from '../common';
import type { ICategoryResponseData } from './common';

export interface ICategoryByIdRequest {
  id: number;
}

export interface ICategoryByIdResponse
  extends IResponse<ICategoryResponseData> {}
