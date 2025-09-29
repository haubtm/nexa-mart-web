import type { IProductListResponse } from '@/dtos';
import { useProductList } from '@/features/main/react-query';
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
    useState<IProductListResponse['data']['products'][number]>();

  const [queryParams, setQueryParams] = useQueryParams({
    page: withDefault(NumberParam, DEFAULT_PAGE),
    size: withDefault(NumberParam, DEFAULT_PAGE_SIZE),
    search: withDefault(StringParam, undefined),
    sorts: withDefault(JsonParam, undefined),
  });
  const { data: productListData, isFetching: isProductListLoading } =
    useProductList(queryParams);

  return {
    ref,
    record,
    setRecord,
    queryParams,
    setQueryParams,
    productListData,
    isProductListLoading,
  };
};
