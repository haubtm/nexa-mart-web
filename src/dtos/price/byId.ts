import type { IResponse } from '../common';
import type { IPriceDetail, IPriceResponseData } from './common';

export interface IPriceByIdRequest {
  priceId: number;
  includeDetails?: boolean;
}

export interface IPriceByIdResponse extends IResponse<IPriceResponseData> {}

export interface IPriceDetailByIdRequest {
  priceId: number;
}

export interface IPriceDetailByIdResponse extends IResponse<IPriceDetail[]> {}

export interface IPriceActiveByIdRequest {
  priceId: number;
}

export interface IPriceActiveByIdResponse
  extends IResponse<IPriceResponseData> {}

export interface IPricePauseByIdRequest {
  priceId: number;
}

export interface IPricePauseByIdResponse
  extends IResponse<IPriceResponseData> {}
