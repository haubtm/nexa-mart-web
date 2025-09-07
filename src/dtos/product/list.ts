import type { IResponse } from '../common';
import type { IProductResponseData } from './common';

export interface IProductListResponse
  extends IResponse<IProductResponseData[]> {}
