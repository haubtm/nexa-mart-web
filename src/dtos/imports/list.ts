import type { IPageable, IResponse } from '../common';
import type { IImportsResponseData } from './common';

export interface IImportsListResponse
  extends IResponse<
    {
      content: IImportsResponseData[];
    } & IPageable
  > {}
