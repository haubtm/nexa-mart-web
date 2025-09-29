import { SvgTrashIcon } from '@/assets';
import { productKeys, useProductDelete } from '@/features/main/react-query';
import {
  Button,
  Flex,
  formatDate,
  type ITableProps,
  useModal,
  useNotification,
} from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/Product/hook';
import type { IProductListResponse } from '@/dtos';
import UpdateProductModal from '../UpdateProductModal';

export const useHook = () => {
  const { notify } = useNotification();
  const { modal } = useModal();
  const { mutateAsync: deleteBranches } = useProductDelete();
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    IProductListResponse['data']['products'][number]
  >['columns'] = [
    {
      key: 'id',
      title: 'STT',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => index,
    },
    {
      key: 'name',
      title: 'Tên sản phẩm',
      width: 120,
      render: (_, record) => record?.name,
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      width: 130,
      render: (_, record) => formatDate(record?.createdDate),
    },
    {
      key: 'updated_at',
      title: 'Ngày cập nhật',
      width: 120,
      render: (_, record) => formatDate(record?.updatedAt),
    },
    {
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Flex gap={8} style={{ display: 'inline-flex' }}>
          <div onClick={(e) => e.stopPropagation()}>
            <UpdateProductModal record={record} />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([record?.id], record);
            }}
          />
        </Flex>
      ),
    },
  ];

  const variantColumns: ITableProps<
    IProductListResponse['data']['content'][number]['variants'][number]
  >['columns'] = [
    {
      key: 'variantId',
      title: 'Mã biến thể',
      width: 140,
      render: (_, record) => record?.variantCode || '-',
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

  const handleDelete = (
    ids: number[],
    record?: IProductListResponse['data']['content'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa sản phẩm`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các sản phẩm này không?`
      : `Bạn có chắc chắn muốn xóa sản phẩm ${record?.name} này không?`;

    modal('confirm', {
      title,
      content,
      onOk: async () => {
        try {
          await deleteBranches(
            {
              ids,
            },
            {
              onSuccess: () => {
                notify('success', {
                  message: 'Thành công',
                  description: 'Xóa sản phẩm thành công',
                });

                queryClient.invalidateQueries({
                  queryKey: productKeys.lists(),
                  refetchType: 'all',
                });

                if (isDeleteSelected) {
                  setSelectedRowKeys([]);
                }
              },
              onError: (error: any) => {
                notify('error', {
                  message: 'Thất bại',
                  description: error.message,
                });
              },
            },
          );
        } catch (e) {
          return Promise.reject(e);
        }
      },
    });
  };

  return {
    columns,
    variantColumns,
    selectedRowKeys,
    setSelectedRowKeys,
    handleDelete,
  };
};
