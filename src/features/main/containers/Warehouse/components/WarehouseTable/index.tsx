import { type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Warehouse/hook';
import { useHook } from './hook';
import type { IWarehouseListResponse } from '@/dtos';
import React from 'react';

interface IWarehouseTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IWarehouseListResponse['data']['content'][number],
  ) => void;
}

const WarehouseTable = ({ ref, setRecord }: IWarehouseTableProps) => {
  const { columns } = useHook();
  const {
    queryParams,
    setQueryParams,
    warehouseListData,
    isWarehouseListLoading,
  } = useCommonHook();

  return (
    <Table<IWarehouseListResponse['data']['content'][number]>
      columns={columns}
      dataSource={warehouseListData?.data?.content || []}
      loading={isWarehouseListLoading}
      pagination={{
        total: warehouseListData?.data?.totalPages,
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

export default WarehouseTable;
