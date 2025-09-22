import type { IResponse } from '../common';
import type { IImportsResponseData } from './common';

export interface IImportsCreateRequest {
  importCode: string;
  supplierId: number;
  importDate: string;
  notes?: string;
  importDetails: {
    variantId: number;
    quantity: number;
    notes?: string;
  }[];
}

export interface IImportsCreateResponse
  extends IResponse<IImportsResponseData> {}
