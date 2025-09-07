import type { IResponse } from '../common';

export interface IProductDeleteRequest {
  ids: number[];
}

export interface IProductDeleteResponse extends IResponse<null> {}
