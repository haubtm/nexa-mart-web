import type { IResponse } from '../common';
import type { IPriceResponseData } from './common';

interface IPriceDetail {
  variantId: number;
  salePrice: number;
}

export interface IPriceCreateRequest {
  priceName: string;
  priceCode: string;
  startDate: string;
  endDate: string;
  description?: string;
  priceDetails?: IPriceDetail[];
}

export interface IPriceCreateResponse extends IResponse<IPriceResponseData> {}

export interface IPriceDetailCreateRequest {
  priceId: number;
  variants: {
    variantId: number;
    price: number;
  }[];
}

export interface IPriceDetailCreateResponse
  extends IResponse<IPriceResponseData> {}
