import type { IResponse } from '../common';
import type { ISupplierResponseData } from './common';

export interface ISupplierByIdRequest {
  id: number;
}

export interface ISupplierByIdResponse
  extends IResponse<ISupplierResponseData> {}
