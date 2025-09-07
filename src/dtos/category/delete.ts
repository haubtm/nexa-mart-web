import type { IResponse } from '../common';

export interface ICategoryDeleteRequest {
  ids: number[];
}

export interface ICategoryDeleteResponse extends IResponse<null> {}
