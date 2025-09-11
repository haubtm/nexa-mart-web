import type { IResponse } from '../common';
import type { ICategoryResponseData } from './common';

export interface ICategoryCreateRequest {
  name: string;
  description?: string;
  parentId?: number;
}

export interface ICategoryCreateResponse
  extends IResponse<ICategoryResponseData> {}
