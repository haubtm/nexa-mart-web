import { EDeliveryType, EOrderStatus } from '@/lib';
import type { IPageable, IResponse } from '../common';
import { IOrderResponseData } from './common';

export interface IAdminOrderListRequest {
  status?: EOrderStatus;
  deliveryType?: EDeliveryType;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
}

export interface IAdminOrderListResponse
  extends IResponse<
    {
      content: IOrderResponseData[];
    } & IPageable
  > {}
