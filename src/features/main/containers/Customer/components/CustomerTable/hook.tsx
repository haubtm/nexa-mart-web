import { SvgTrashIcon } from '@/assets';
import { customerKeys, useCustomerDelete } from '@/features/main/react-query';
import {
  Button,
  ECustomerType,
  EGender,
  Flex,
  formatDate,
  type ITableProps,
  useModal,
  useNotification,
} from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useState } from 'react';
import type { ICustomerListResponse } from '@/dtos';
import UpdateCustomerModal from '../UpdateCustomerModal';
import { Tag } from 'antd';

export const useHook = () => {
  const { notify } = useNotification();
  const { modal } = useModal();
  const { mutateAsync: deleteBranches } = useCustomerDelete();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    ICustomerListResponse['data']['content'][number]
  >['columns'] = [
    {
      key: 'id',
      title: 'STT',
      fixed: 'left',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      key: 'name',
      fixed: 'left',
      title: 'Họ và tên',
      width: 120,
      render: (_, record) => record?.name,
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
      width: 150,
      render: (_, record) => record?.phone,
    },
    {
      key: 'dateofbirth',
      title: 'Ngày sinh',
      width: 100,
      render: (_, record) => formatDate(record?.dateOfBirth),
    },
    {
      key: 'address',
      title: 'Địa chỉ',
      width: 200,
      render: (_, record) => record?.address,
    },
    {
      key: 'gender',
      title: 'Giới tính',
      width: 100,
      render: (_, record) => (record?.gender === EGender.MALE ? 'Nam' : 'Nữ'),
    },
    {
      key: 'role',
      title: 'Nhóm khách hàng',
      width: 200,
      render: (_, record) => (
        <Tag
          color={
            record?.customerType === ECustomerType.REGULAR ? 'green' : 'blue'
          }
        >
          {record?.customerType === ECustomerType.REGULAR ? 'Thường' : 'VIP'}
        </Tag>
      ),
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
            <UpdateCustomerModal record={record} />
          </div>
          <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete([record?.customerId], record);
            }}
          />
        </Flex>
      ),
    },
  ];

  const handleDelete = (
    ids: number[],
    record?: ICustomerListResponse['data']['content'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa khách hàng`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các khách hàng này không?`
      : `Bạn có chắc chắn muốn xóa khách hàng ${record?.name} này không?`;

    modal('confirm', {
      title,
      content,
      onOk: async () => {
        try {
          await deleteBranches(
            {
              customerIds: ids,
            },
            {
              onSuccess: () => {
                notify('success', {
                  message: 'Thành công',
                  description: 'Xóa khách hàng thành công',
                });

                queryClient.invalidateQueries({
                  queryKey: customerKeys.lists(),
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
