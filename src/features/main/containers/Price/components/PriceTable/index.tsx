import { Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Price/hook';
import { useHook } from './hook';
import type { IPriceListResponse } from '@/dtos';

// interface IPriceHistoryTableProps {
//   ref: React.RefObject<IModalRef | null>;
//   setRecord: (
//     record: IInventoryHistoryResponse['data']['content'][number],
//   ) => void;
// }

const PriceTable = () =>
  // { ref, setRecord }: IPriceHistoryTableProps
  {
    const { columns } = useHook();
    const { queryParams, setQueryParams, priceListData, isPriceListLoading } =
      useCommonHook();

    return (
      <Table<IPriceListResponse['data']['content'][number]>
        columns={columns}
        dataSource={priceListData?.data?.content || []}
        loading={isPriceListLoading}
        pagination={{
          total: priceListData?.data?.totalPages,
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

export default PriceTable;
