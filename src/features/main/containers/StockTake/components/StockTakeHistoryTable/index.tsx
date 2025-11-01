import { Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/StockTake/hook';
import { useHook } from './hook';
import type { IStockTakeListResponse } from '@/dtos';

// interface IStockTakeHistoryTableProps {
//   ref: React.RefObject<IModalRef | null>;
//   setRecord: (
//     record: IInventoryHistoryResponse['data']['content'][number],
//   ) => void;
// }

const StockTakeHistoryTable = () =>
  //   {
  //   ref,
  //   setRecord,
  // }: IStockTakeHistoryTableProps
  {
    const { columns, selectedRowKeys, setSelectedRowKeys } = useHook();
    const {
      queryParams,
      setQueryParams,
      stockTakeListData,
      isStockTakeListLoading,
    } = useCommonHook();

    return (
      <Table<IStockTakeListResponse['data']['content'][number]>
        rowKey="stocktakeId"
        // selectionBar={{
        //   actionButtons: (
        //     <Button
        //       type="primary"
        //       danger
        //       icon={<SvgTrashIcon width={12} height={12} />}
        //       onClick={() => handleDelete(selectedRowKeys)}
        //     >
        //       Xóa
        //     </Button>
        //   ),
        // }}
        rowSelection={{
          selectedRowKeys: selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys as number[]),
        }}
        columns={columns}
        dataSource={stockTakeListData?.data?.content || []}
        loading={isStockTakeListLoading}
        pagination={{
          total: stockTakeListData?.data?.totalPages,
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
