import type { IInventoryHistoryResponse } from '@/dtos';
import { useStockTakeList } from '@/features/main/react-query';
import { DEFAULT_PAGE_SIZE, type IModalRef } from '@/lib';
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
    useState<IInventoryHistoryResponse['data']['content'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE_SIZE + 1),
    limit: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
  });
  const { data: stockTakeListData, isFetching: isStockTakeListLoading } =
    useStockTakeList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    stockTakeListData,
    isStockTakeListLoading,
  };
};
