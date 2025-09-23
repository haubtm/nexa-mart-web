import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Imports/hook';
import { useHook } from './hook';
import type { IInventoryHistoryResponse, IImportsListResponse } from '@/dtos';
import React from 'react';
import { SvgTrashIcon } from '@/assets';

interface IImportsHistoryTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IInventoryHistoryResponse['data']['content'][number],
  ) => void;
}

const ImportsHistoryTable = ({ ref, setRecord }: IImportsHistoryTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys } = useHook();
  const { queryParams, setQueryParams, importsListData, isImportsListLoading } =
    useCommonHook();

  return (
    <Table<IImportsListResponse['data']['content'][number]>
      columns={columns}
      dataSource={importsListData?.data?.content || []}
      loading={isImportsListLoading}
      pagination={{
        total: importsListData?.data?.totalPages,
        current: (queryParams.page ?? 0) + 1,
        pageSize: queryParams.limit,
        onChange: (page, pageSize) => {
          setQueryParams({
            ...queryParams,
            page: page - 1,
            limit: pageSize,
          });
        },
      }}
      onRow={() => ({
        // onClick: () => {
        //   setRecord(record);
        //   ref?.current?.open();
        // },
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default ImportsHistoryTable;
