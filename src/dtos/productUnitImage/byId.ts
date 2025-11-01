import { IResponse } from '../common';
import { IProductUnitImageResponseData } from './common';

export interface IProductUnitImageByIdRequest {
  productUnitId: number;
}

export interface IProductUnitImageByIdResponse
  extends IResponse<IProductUnitImageResponseData> {}
