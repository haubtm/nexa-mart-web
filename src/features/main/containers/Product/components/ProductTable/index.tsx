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
  const { columns, selectedRowKeys, setSelectedRowKeys, handleDelete } =
    useHook();
  const { queryParams, setQueryParams, productListData, isProductListLoading } =
    useCommonHook();

  // Columns cho bảng con (variants)
  const variantColumns = [
    {
      title: 'Mã biến thể',
      dataIndex: 'variantCode',
      key: 'variantCode',
      width: 140,
    },
    { title: 'Tên biến thể', dataIndex: 'variantName', key: 'variantName' },
    {
      title: 'Thuộc tính',
      key: 'attributes',
      render: (_: any, record: any) =>
        record?.attributes
          ?.map((a: any) => `${a.attributeName}: ${a.attributeValue}`)
          .join(', ') || '-',
    },
    {
      title: 'Đơn vị',
      key: 'unit',
      render: (_: any, record: any) => record?.unit?.unit ?? '-',
      width: 100,
    },
    {
      title: 'Giá bán',
      dataIndex: 'basePrice',
      key: 'basePrice',
      align: 'right' as const,
      render: (v: number) => v?.toLocaleString() ?? 0,
      width: 120,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantityOnHand',
      key: 'quantityOnHand',
      align: 'right' as const,
      width: 100,
    },
    {
      title: 'Có thể bán',
      dataIndex: 'availableQuantity',
      key: 'availableQuantity',
      align: 'right' as const,
      width: 110,
    },
    {
      title: 'Bán',
      dataIndex: 'allowsSale',
      key: 'allowsSale',
      width: 80,
      render: (v: boolean) => (v ? '✓' : '✗'),
    },
    {
      title: 'Hoạt động',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (v: boolean) => (v ? '✓' : '✗'),
    },
  ];

  return (
    <Table<IProductListResponse['data']['content'][number]>
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
      dataSource={productListData?.data?.content || []}
      loading={isProductListLoading}
      // Bật hàng mở rộng để hiển thị variants
      expandable={{
        expandRowByClick: true,
        rowExpandable: (record) =>
          Array.isArray(record?.variants) && record.variants.length > 0,
        expandedRowRender: (parent) => (
          <Table
            rowKey="variantId"
            columns={variantColumns}
            dataSource={parent.variants || []}
            pagination={false}
            size="small"
            // ✅ Chỉ khi click row con mới mở modal
            onRow={(variant) => ({
              onClick: () => {
                // Nếu modal hiển thị chi tiết biến thể:
                // - Truyền payload vào open (nếu IModalRef.open hỗ trợ)
                setRecord({ ...parent, _selectedVariant: variant } as any);
                ref?.current?.open?.();

                // hoặc dùng setRecord để set ngữ cảnh cho modal (tùy bạn thiết kế):
                // setRecord({ ...parent, _selectedVariant: variant } as any);
              },
              style: { cursor: 'pointer' },
            })}
          />
        ),
      }}
      pagination={{
        total: productListData?.metadata?.total,
        current: (queryParams.page ?? 0) + 1, // antd là 1-based
        pageSize: queryParams.limit,
        onChange: (page, pageSize) => {
          setQueryParams({
            ...queryParams,
            page: page - 1, // backend thường 0-based, nên trừ 1
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

export default ProductTable;
