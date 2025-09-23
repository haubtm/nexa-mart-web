import { type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Transaction/hook';
import { useHook } from './hook';
import type {
  IInventoryHistoryResponse,
  IWarehouseTransactionResponse,
} from '@/dtos';
import React from 'react';

interface ITransactionHistoryTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IInventoryHistoryResponse['data']['content'][number],
  ) => void;
}

const TransactionTable = ({
  ref,
  setRecord,
}: ITransactionHistoryTableProps) => {
  const { columns } = useHook();
  const {
    queryParams,
    setQueryParams,
    transactionListData,
    isTransactionListLoading,
  } = useCommonHook();

  return (
    <Table<IWarehouseTransactionResponse['data']['content'][number]>
      columns={columns}
      dataSource={transactionListData?.data?.content || []}
      loading={isTransactionListLoading}
      pagination={{
        total: transactionListData?.data?.totalPages,
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

export default TransactionTable;
