import type { IResponse } from '../common';

export interface IBrandDeleteRequest {
  ids: number[];
}

export interface IBrandDeleteResponse extends IResponse<null> {}
