import { IResponse } from '../common';
import {
  IProductUnitImageAvailableResponseData,
  IProductUnitImageResponseData,
} from './common';

export interface IProductUnitImageByIdRequest {
  productUnitId: number;
}

export interface IProductUnitImageByIdResponse
  extends IResponse<IProductUnitImageResponseData> {}

export interface IProductUnitImageAvailableByIdRequest {
  productUnitId: number;
}

export interface IProductUnitImageAvailableByIdResponse
  extends IResponse<IProductUnitImageAvailableResponseData[]> {}
