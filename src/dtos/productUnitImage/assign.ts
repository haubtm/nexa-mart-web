import { IResponse } from '../common';
import { IProductUnitImageResponseData } from './common';

export interface IProductUnitImageAssignRequest {
  productUnitId: number;
  productImageIds: number[];
  primaryImageId: number;
}

export interface IProductUnitImageAssignResponse
  extends IResponse<IProductUnitImageResponseData> {}
