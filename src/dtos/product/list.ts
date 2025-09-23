import type { IPageable, IResponse } from '../common';
import type { IProductResponseData, IVariant } from './common';

export interface IProductListResponse
  extends IResponse<
    {
      content: IProductResponseData[];
    } & IPageable
  > {}

export interface IProductVariantListResponse extends IResponse<IVariant[]> {}
