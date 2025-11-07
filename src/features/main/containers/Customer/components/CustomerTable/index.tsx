import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Customer/hook';
import { useHook } from './hook';
import type { ICustomerListResponse } from '@/dtos';

interface ICustomerTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (record: ICustomerListResponse['data']['content'][number]) => void;
}

const CustomerTable = ({ ref, setRecord }: ICustomerTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys, handleDelete } =
    useHook();
  const {
    queryParams,
    setQueryParams,
    customerListData,
    isCustomerListLoading,
  } = useCommonHook();

  return (
    <Table<ICustomerListResponse['data']['content'][number]>
      rowKey="customerId"
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
      dataSource={customerListData?.data?.content}
      loading={isCustomerListLoading}
      pagination={{
        total: customerListData?.data?.totalElements,
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
      onRow={(record: ICustomerListResponse['data']['content'][number]) => ({
        onClick: () => {
          setRecord(record);
          ref?.current?.open();
        },
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default CustomerTable;
