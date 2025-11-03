import { IResponse } from '../common';
import { IProductUnitImageResponseData } from './common';

export interface IProductUnitImagePrimaryRequest {
  productUnitId: number;
  productImageId: number;
}

export interface IProductUnitImagePrimaryResponse
  extends IResponse<IProductUnitImageResponseData> {}
