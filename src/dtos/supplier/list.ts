import type { IPageable, IResponse } from '../common';
import type { ISupplierResponseData } from './common';

export interface ISupplierListResponse
  extends IResponse<
    {
      content: ISupplierResponseData[];
    } & IPageable
  > {}
