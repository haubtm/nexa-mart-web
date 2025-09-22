import type { IPageable, IResponse } from '../common';
import type { IImportsResponseData } from './common';

export interface IImportsByIdRequest {
  id: number;
}

export interface IImportsByIdResponse extends IResponse<IImportsResponseData> {}

export interface IImportsBySupplierIdRequest {
  supplierId: number;
}

export interface IImportsBySupplierIdResponse
  extends IResponse<
    {
      content: IImportsResponseData[];
    } & IPageable
  > {}
