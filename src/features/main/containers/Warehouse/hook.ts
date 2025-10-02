import type { IWarehouseListResponse } from '@/dtos';
import { DEFAULT_PAGE_SIZE, type IModalRef } from '@/lib';
import { useRef, useState } from 'react';
import {
  JsonParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params';
import { useWarehouseList } from '../../react-query';

export const useCommonHook = () => {
  const ref = useRef<IModalRef>(null);
  const [record, setRecord] =
    useState<IWarehouseListResponse['data']['content'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, 0),
    limit: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
  });
  const { data: warehouseListData, isFetching: isWarehouseListLoading } =
    useWarehouseList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    warehouseListData,
    isWarehouseListLoading,
  };
};
