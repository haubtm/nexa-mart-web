import type { IResponse } from '../common';

export interface ISupplierDeleteRequest {
  supplierIds: number[];
}

export interface ISupplierDeleteResponse extends IResponse<null> {}
