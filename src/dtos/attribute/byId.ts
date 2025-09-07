import type { IResponse } from '../common';
import type { IAttributeResponseData } from './common';

export interface IAttributeByIdRequest {
  id: number;
}

export interface IAttributeByIdResponse
  extends IResponse<IAttributeResponseData> {}
