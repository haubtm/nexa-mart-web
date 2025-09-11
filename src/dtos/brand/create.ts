import type { IResponse } from '../common';
import type { IBrandResponseData } from './common';

export interface IBrandCreateRequest {
  name: string;
  brandCode?: string;
  logoUrl?: string;
  description?: string;
}

export interface IBrandCreateResponse extends IResponse<IBrandResponseData> {}
