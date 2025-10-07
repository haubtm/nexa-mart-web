import type { IPromotionListResponse } from '@/dtos';
import { usePromotionList } from '@/features/main/react-query';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, type IModalRef } from '@/lib';
import { useRef, useState } from 'react';
import {
  JsonParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';

export const useCommonHook = () => {
  const ref = useRef<IModalRef>(null);
  const [record, setRecord] =
    useState<IPromotionListResponse['data']['content'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE),
    size: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sortDirection: withDefault(JsonParam, 'asc'),
  });
  const { data: promotionListData, isFetching: isPromotionListLoading } =
    usePromotionList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    promotionListData,
    isPromotionListLoading,
  };
};
