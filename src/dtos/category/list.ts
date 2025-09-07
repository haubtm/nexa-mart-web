import type { IResponse } from '../common';
import type { ICategoryResponseData } from './common';

export interface ICategoryListResponse
  extends IResponse<ICategoryResponseData[]> {}
