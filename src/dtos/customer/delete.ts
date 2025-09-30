import type { IResponse } from '../common';

export interface ICustomerDeleteRequest {
  customerIds: number[];
}

export interface ICustomerDeleteResponse extends IResponse<null> {}
