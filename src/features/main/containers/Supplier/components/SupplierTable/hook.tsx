import { SvgTrashIcon } from '@/assets';
import { supplierKeys, useSupplierDelete } from '@/features/main/react-query';
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
import { useCommonHook } from '@/features/main/containers/Supplier/hook';
import type { ISupplierListResponse } from '@/dtos';
import UpdateSupplierModal from '../UpdateSupplierModal';

export const useHook = () => {
  const { notify } = useNotification();
  const { modal } = useModal();
  const { mutateAsync: deleteBranches } = useSupplierDelete();
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    ISupplierListResponse['data']['content'][number]
  >['columns'] = [
    {
      key: 'id',
      title: 'STT',
      fixed: 'left',
      width: 60,
      render: (_, __, index) =>
        index + 1 + queryParams.page * queryParams.limit,
    },
    {
      key: 'name',
      title: 'Tên nhà cung cấp',
      fixed: 'left',
      width: 120,
      render: (_, record) => record?.name,
    },
    {
      key: 'code',
      title: 'Mã NCC',
      width: 120,
      render: (_, record) => record?.code,
    },
    {
      key: 'email',
      title: 'Email',
      width: 200,
      render: (_, record) => record?.email,
    },
    {
      key: 'phone',
      title: 'Số điện thoại',
      width: 120,
      render: (_, record) => record?.phone,
    },
    {
      key: 'created_at',
      title: 'Ngày tạo',
      width: 130,
      render: (_, record) => formatDate(record?.createdAt),
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
            <UpdateSupplierModal record={record} />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([record?.supplierId], record);
            }}
          />
        </Flex>
      ),
    },
  ];

  const handleDelete = (
    ids: number[],
    record?: ISupplierListResponse['data']['content'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa nhà cung cấp`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các nhà cung cấp này không?`
      : `Bạn có chắc chắn muốn xóa nhà cung cấp ${record?.name} này không?`;

    modal('confirm', {
      title,
      content,
      onOk: async () => {
        try {
          await deleteBranches(
            {
              supplierIds: ids,
            },
            {
              onSuccess: () => {
                notify('success', {
                  message: 'Thành công',
                  description: 'Xóa nhà cung cấp thành công',
                });

                queryClient.invalidateQueries({
                  queryKey: supplierKeys.lists(),
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
    selectedRowKeys,
    setSelectedRowKeys,
    handleDelete,
  };
};
