import type { ICustomerListResponse } from '@/dtos';
import { useCustomerList } from '@/features/main/react-query';
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
    useState<ICustomerListResponse['data']['content'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE),
    limit: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    searchTerm: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
  });
  const { data: customerListData, isFetching: isCustomerListLoading } =
    useCustomerList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    customerListData,
    isCustomerListLoading,
  };
};
