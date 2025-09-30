import type { IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface ICustomerByIdRequest {
  customerId: number;
}

export interface ICustomerByIdResponse
  extends IResponse<ICustomerResponseData> {}
