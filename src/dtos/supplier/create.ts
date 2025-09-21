import type { IResponse } from '../common';
import type { ISupplierResponseData } from './common';

export interface ISupplierCreateRequest {
  code: string;
  name: string;
  address: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

export interface ISupplierCreateResponse
  extends IResponse<ISupplierResponseData> {}
