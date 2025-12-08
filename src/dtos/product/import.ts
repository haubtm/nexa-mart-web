import type { IResponse } from '../common';

export interface IProductImportRequest {
  file: File;
}

export interface IProductImportResponse extends IResponse<null> {}
