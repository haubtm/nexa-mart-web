import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Supplier/hook';
import { useHook } from './hook';
import type { ISupplierListResponse } from '@/dtos';

interface ISupplierTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (record: ISupplierListResponse['data']['content'][number]) => void;
}

const SupplierTable = ({ ref, setRecord }: ISupplierTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys, handleDelete } =
    useHook();
  const {
    queryParams,
    setQueryParams,
    supplierListData,
    isSupplierListLoading,
  } = useCommonHook();

  return (
    <Table<ISupplierListResponse['data']['content'][number]>
      rowKey="supplierId"
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
        onChange: (selectedRowKeys) => {
          setSelectedRowKeys(selectedRowKeys as number[]);
        },
      }}
      columns={columns}
      dataSource={supplierListData?.data?.content}
      loading={isSupplierListLoading}
      pagination={{
        total: supplierListData?.data?.totalPages,
        current: queryParams.page + 1,
        pageSize: queryParams.limit,
        onChange: (page, pageSize) => {
          setQueryParams({
            ...queryParams,
            page: page - 1,
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
      onRow={(record: ISupplierListResponse['data']['content'][number]) => ({
        onClick: () => {
          setRecord(record);
          ref?.current?.open();
        },
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default SupplierTable;
