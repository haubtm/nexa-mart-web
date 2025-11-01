import { Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Imports/hook';
import { useHook } from './hook';
import type { IImportsListResponse } from '@/dtos';

// interface IImportsHistoryTableProps {
//   ref: React.RefObject<IModalRef | null>;
//   setRecord: (
//     record: IInventoryHistoryResponse['data']['content'][number],
//   ) => void;
// }

const ImportsHistoryTable = () =>
  // { ref, setRecord }: IImportsHistoryTableProps
  {
    const { columns } = useHook();
    const {
      queryParams,
      setQueryParams,
      importsListData,
      isImportsListLoading,
    } = useCommonHook();

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
