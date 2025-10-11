import { Dayjs } from 'dayjs';
import type { IResponse } from '../common';
import type { IPriceResponseData } from './common';

interface IPriceDetail {
  productUnitId: number;
  salePrice: number;
}

export interface IPriceCreateRequest {
  priceName: string;
  priceCode: string;
  startDate: string | Dayjs;
  endDate?: string | Dayjs;
  description?: string;
  priceDetails?: IPriceDetail[];
  status?: string;
  __searchPick?: any; // for select search only
}

export interface IPriceCreateResponse extends IResponse<IPriceResponseData> {}

export interface IPriceDetailCreateRequest {
  priceId: number;
  productUnit: {
    productUnitId: number;
    salePrice: number;
  }[];
}

export interface IPriceDetailCreateResponse
  extends IResponse<IPriceResponseData> {}
