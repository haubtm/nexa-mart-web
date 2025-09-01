import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Employee/hook';
import { useHook } from './hook';
import type { IEmployeeListResponse } from '@/dtos';

interface IEmployeeTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (record: IEmployeeListResponse['data'][number]) => void;
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
    <Table<IEmployeeListResponse['data'][number]>
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
      dataSource={employeeListData?.data}
      loading={isEmployeeListLoading}
      pagination={{
        total: employeeListData?.metadata?.total,
        current: queryParams.page,
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
      onRow={(record: IEmployeeListResponse['data'][number]) => ({
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
