import { SvgTrashIcon } from '@/assets';
import { Button, type IModalRef, Table } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Product/hook';
import { useHook } from './hook';
import type { IProductListResponse } from '@/dtos';
import React from 'react';

interface IProductTableProps {
  ref: React.RefObject<IModalRef | null>;
  setRecord: (record: IProductListResponse['data']['content'][number]) => void;
}

const ProductTable = ({ ref, setRecord }: IProductTableProps) => {
  const {
    columns,
    variantColumns,
    selectedRowKeys,
    setSelectedRowKeys,
    handleDelete,
  } = useHook();
  const { queryParams, setQueryParams, productListData, isProductListLoading } =
    useCommonHook();

  return (
    <Table<IProductListResponse['data']['products'][number]>
      rowKey="id"
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
        onChange: (keys) => setSelectedRowKeys(keys as number[]),
      }}
      columns={columns}
      dataSource={productListData?.data?.products || []}
      loading={isProductListLoading}
      pagination={{
        total: productListData?.data?.pageInfo?.totalPages,
        current: (queryParams.page ?? 0) + 1, // antd là 1-based
        pageSize: queryParams.size,
        onChange: (page, pageSize) => {
          setQueryParams({
            ...queryParams,
            page: page - 1, // backend thường 0-based, nên trừ 1
            size: pageSize,
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

export default ProductTable;
