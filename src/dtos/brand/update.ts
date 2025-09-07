import type { IResponse } from '../common';
import type { IBrandResponseData } from './common';

export interface IBrandUpdateRequest {
  brandId: number;
  name: string;
  brandCode: string;
  logoUrl?: string;
  description: string;
  isActive: boolean;
}

export interface IBrandUpdateResponse extends IResponse<IBrandResponseData> {}
