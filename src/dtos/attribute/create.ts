import type { IResponse } from '../common';
import type { IAttributeResponseData } from './common';

export interface IAttributeCreateRequest {
  name: string;
}

export interface IAttributeCreateResponse
  extends IResponse<IAttributeResponseData> {}
