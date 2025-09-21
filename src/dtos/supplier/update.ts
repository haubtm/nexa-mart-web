import type { IResponse } from '../common';
import type { ISupplierResponseData } from './common';

export interface ISupplierUpdateRequest {
  id: number;
  name: string;
  address: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

export interface ISupplierUpdateResponse
  extends IResponse<ISupplierResponseData> {}
