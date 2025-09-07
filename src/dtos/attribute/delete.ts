import type { IResponse } from '../common';

export interface IAttributeDeleteRequest {
  ids: number[];
}

export interface IAttributeDeleteResponse extends IResponse<null> {}
