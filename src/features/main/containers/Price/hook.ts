import type { IPriceListResponse } from '@/dtos';
import { usePriceList } from '@/features/main/react-query';
import { DEFAULT_PAGE_SIZE, ESortDirection, type IModalRef } from '@/lib';
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
    useState<IPriceListResponse['data']['content'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, 0),
    limit: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
    sortDirection: withDefault(StringParam, ESortDirection.ASC),
    includeDetails: withDefault(JsonParam, true),
  });
  const { data: priceListData, isFetching: isPriceListLoading } =
    usePriceList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    priceListData,
    isPriceListLoading,
  };
};
