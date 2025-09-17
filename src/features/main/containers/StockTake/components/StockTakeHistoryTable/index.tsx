import { type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/StockTake/hook';
import { useHook } from './hook';
import type { IInventoryHistoryResponse } from '@/dtos';
import React from 'react';

interface IStockTakeHistoryTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IInventoryHistoryResponse['data']['content'][number],
  ) => void;
}

const StockTakeHistoryTable = ({
  ref,
  setRecord,
}: IStockTakeHistoryTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys } = useHook();
  const {
    queryParams,
    setQueryParams,
    inventoryListData,
    isInventoryListLoading,
  } = useCommonHook();

  return (
    <Table<IInventoryHistoryResponse['data']['content'][number]>
      rowKey="id"
      //   selectionBar={{
      //     actionButtons: (
      //       <Button
      //         type="primary"
      //         danger
      //         icon={<SvgTrashIcon width={12} height={12} />}
      //         onClick={() => handleDelete(selectedRowKeys)}
      //       >
      //         Xóa
      //       </Button>
      //     ),
      //   }}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as number[]),
      }}
      columns={columns}
      dataSource={inventoryListData?.data?.content || []}
      loading={isInventoryListLoading}
      pagination={{
        total: inventoryListData?.data?.totalPages,
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

export default StockTakeHistoryTable;
