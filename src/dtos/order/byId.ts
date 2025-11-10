import type { IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IAdminOrderByIdRequest {
  orderId: number;
}

export interface IAdminOrderByIdResponse
  extends IResponse<IOrderResponseData> {}
