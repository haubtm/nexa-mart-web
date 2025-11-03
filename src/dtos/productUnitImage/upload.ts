import { IResponse } from '../common';
import { IProductUnitImageResponseData } from './common';

export interface IProductUnitImageUploadRequest {
  productUnitId: number;
  imageAlt?: string;
  isPrimary: boolean;
  displayOrder?: number;
  imageFile: File;
}

export interface IProductUnitImageUploadResponse
  extends IResponse<IProductUnitImageResponseData['images'][number]> {}
