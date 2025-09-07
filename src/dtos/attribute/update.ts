import type { IResponse } from '../common';
import type { IAttributeResponseData } from './common';

export interface IAttributeUpdateRequest {
  id: number;
  name: string;
}

export interface IAttributeUpdateResponse
  extends IResponse<IAttributeResponseData> {}
