import type { IResponse } from '../common';

export interface IEmployeeDeleteRequest {
  ids: number[];
}

export interface IEmployeeDeleteResponse extends IResponse<null> {}
