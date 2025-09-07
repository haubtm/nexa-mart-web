import type { IResponse } from '../common';
import type { IAttributeResponseData } from './common';

export interface IAttributeListResponse
  extends IResponse<IAttributeResponseData[]> {}
