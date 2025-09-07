import type { IResponse } from '../common';
import type { IProductResponseData } from './common';
import type { IProductCreateRequest } from './create';

export interface IProductUpdateRequest
  extends Partial<Omit<IProductCreateRequest, 'id'>> {
  id: number;
}

export interface IProductUpdateResponse
  extends IResponse<IProductResponseData> {}
