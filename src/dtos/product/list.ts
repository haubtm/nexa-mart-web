import type { IResponse } from '../common';
import type { IProductResponseData } from './common';
interface IPageable {
  pageInfo: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isFirst: boolean;
    isLast: boolean;
    hasPrevious: boolean;
    hasNext: boolean;
  };
}

export interface IProductListRequest {
  page?: number;
  size?: number;
  searchTerm?: string;
  categoryId?: number;
  brandId?: number;
  isActive?: boolean;
  hasPrice?: boolean;
  hasStock?: boolean;
  sort?: string[];
}

export interface IProductListResponse
  extends IResponse<
    {
      products: IProductResponseData[];
    } & IPageable
  > {}
