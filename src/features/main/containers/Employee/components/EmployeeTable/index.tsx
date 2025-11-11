import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Employee/hook';
import { useHook } from './hook';
import type { IEmployeeListResponse } from '@/dtos';

interface IEmployeeTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (
    record: IEmployeeListResponse['data']['employees'][number],
  ) => void;
}

const EmployeeTable = ({ ref, setRecord }: IEmployeeTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys, handleDelete } =
    useHook();
  const {
    queryParams,
    setQueryParams,
    employeeListData,
    isEmployeeListLoading,
  } = useCommonHook();

  return (
    <Table<IEmployeeListResponse['data']['employees'][number]>
      selectionBar={{
        actionButtons: (
          <Button
            type="primary"
            danger
            icon={<SvgTrashIcon width={12} height={12} />}
            onClick={() => handleDelete(selectedRowKeys)}
          >
            Xóa
          </Button>
        ),
      }}
      rowSelection={{
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedRowKeys) =>
          setSelectedRowKeys(selectedRowKeys as number[]),
      }}
      columns={columns}
      dataSource={employeeListData?.data?.employees || []}
      loading={isEmployeeListLoading}
      pagination={{
        total: employeeListData?.metadata?.total,
        current: queryParams.page + 1,
        pageSize: queryParams.limit,
        onChange: (page, pageSize) => {
          setQueryParams({
            ...queryParams,
            page,
            limit: pageSize,
          });
        },
      }}
      // onChange={(_, __, sorter) => {
      //   const sorts = formatAntdTableSort(sorter);

      //   setQueryParams({
      //     ...queryParams,
      //     sorts,
      //   });
      // }}
      onRow={(record: IEmployeeListResponse['data']['employees'][number]) => ({
        onClick: () => {
          setRecord(record);
          ref?.current?.open();
        },
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default EmployeeTable;
