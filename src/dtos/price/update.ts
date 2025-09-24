import { PriceStatus } from '@/lib';
import type { IResponse } from '../common';
import type { IPriceResponseData } from './common';

interface IPriceDetail {
  priceDetailId: number;
  variantId: number;
  salePrice: number;
  deleted?: boolean;
}

export interface IPriceUpdateRequest {
  priceId: number;
  priceName: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: PriceStatus;
  priceDetails: IPriceDetail[];
  endDateValid: boolean;
}

export interface IPriceUpdateResponse extends IResponse<IPriceResponseData> {}
