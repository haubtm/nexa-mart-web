import { SvgTrashIcon } from '@/assets';
import { employeeKeys, useEmployeeDelete } from '@/features/main/react-query';
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
import { useCommonHook } from '@/features/main/containers/Employee/hook';
import type { IEmployeeListResponse } from '@/dtos';
import UpdateEmployeeModal from '../UpdateEmployeeModal';

export const useHook = () => {
  const { notify } = useNotification();
  const { modal } = useModal();
  const { mutateAsync: deleteBranches } = useEmployeeDelete();
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    IEmployeeListResponse['data']['employees'][number]
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
      title: 'Họ và tên',
      width: 120,
      render: (_, record) => record?.name,
    },
    {
      key: 'employeeCode',
      title: 'Mã nhân viên',
      width: 120,
      render: (_, record) => record?.employeeCode,
    },
    {
      key: 'email',
      title: 'Email',
      width: 200,
      render: (_, record) => record?.email,
    },
    {
      key: 'role',
      title: 'Vai trò',
      width: 200,
      render: (_, record) => record?.role,
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
            <UpdateEmployeeModal record={record} />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([record?.employeeId], record);
            }}
          />
        </Flex>
      ),
    },
  ];

  const handleDelete = (
    ids: number[],
    record?: IEmployeeListResponse['data']['employees'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa nhân viên`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các nhân viên này không?`
      : `Bạn có chắc chắn muốn xóa nhân viên ${record?.name} này không?`;

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
                  description: 'Xóa nhân viên thành công',
                });

                queryClient.invalidateQueries({
                  queryKey: employeeKeys.lists(),
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
