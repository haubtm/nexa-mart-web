import type { IResponse } from '../common';

export interface IProductCreateRequest {
  name: string;
  code: string;
}

interface IResponseData {
  name: string;
  code: string;
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface IProductCreateResponse extends IResponse<IResponseData> {}
