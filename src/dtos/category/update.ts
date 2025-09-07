import type { IResponse } from '../common';
import type { ICategoryResponseData } from './common';

export interface ICategoryUpdateRequest {
  id: number;
  name: string;
  description: string;
  parentId?: number;
}

export interface ICategoryUpdateResponse
  extends IResponse<ICategoryResponseData> {}
