import type { IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IAdminOrderUpdateStatusRequest {
  orderId: number;
  newStatus: string;
  note?: string;
}

export interface IAdminOrderUpdateStatusResponse
  extends IResponse<IOrderResponseData> {}

export interface IAdminOrderCancelRequest {
  orderId: number;
  reason: string;
}

export interface IAdminOrderCancelResponse
  extends IResponse<IOrderResponseData> {}
