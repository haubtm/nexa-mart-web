import type { IEmployeeListResponse } from '@/dtos';
import { useEmployeeList } from '@/features/main/react-query';
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
    useState<IEmployeeListResponse['data']['employees'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE),
    limit: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
  });
  const { data: employeeListData, isFetching: isEmployeeListLoading } =
    useEmployeeList({
      keyword: queryParams.search,
      page: queryParams.page,
      size: queryParams.limit,
    });

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    employeeListData,
    isEmployeeListLoading,
  };
};
