import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Product/hook';
import { useHook } from './hook';
import type { IProductListResponse } from '@/dtos';

interface IProductTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (record: IProductListResponse['data'][number]) => void;
}

const ProductTable = ({ ref, setRecord }: IProductTableProps) => {
  const { columns, selectedRowKeys, setSelectedRowKeys, handleDelete } =
    useHook();
  const { queryParams, setQueryParams, productListData, isProductListLoading } =
    useCommonHook();

  return (
    <Table<IProductListResponse['data'][number]>
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
      dataSource={productListData?.data?.content || []}
      loading={isProductListLoading}
      pagination={{
        total: productListData?.metadata?.total,
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
      onRow={(record: IProductListResponse['data'][number]) => ({
        onClick: () => {
          setRecord(record);
          ref?.current?.open();
        },
        style: { cursor: 'pointer' },
      })}
    />
  );
};

export default ProductTable;
