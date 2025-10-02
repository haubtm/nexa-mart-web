import { EPromotionStatus, EPromotionType } from '@/lib';
import type { IPageable, IResponse } from '../common';
import type { IPromotionResponseData } from './common';
import { Dayjs } from 'dayjs';

export interface IPromotionListRequest {
  keyword?: string;
  status?: EPromotionStatus;
  promotionType?: EPromotionType;
  startDateFrom?: string | Dayjs;
  startDateTo?: string | Dayjs;
  endDateFrom?: string | Dayjs;
  endDateTo?: string | Dayjs;
  activeOnly?: boolean;
  upcomingOnly?: boolean;
  expiredOnly?: boolean;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface IPromotionListResponse
  extends IResponse<
    {
      content: IPromotionResponseData[];
    } & IPageable
  > {}
