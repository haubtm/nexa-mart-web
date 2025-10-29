import {
  Button,
  Flex,
  formatDate,
  PriceStatus,
  useModal,
  useNotification,
  type ITableProps,
} from '@/lib';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/Price/hook';
import type { IPriceListResponse } from '@/dtos';
import UpdatePriceModal from '../UpdatePriceModal';
import { Tag } from 'antd';
import { priceKeys, usePriceDelete } from '@/features/main/react-query';
import { queryClient } from '@/providers/ReactQuery';
import { SvgTrashIcon } from '@/assets';

const getStatusColorLabel = (status: string) => {
  switch (status) {
    case PriceStatus.ACTIVE:
      return { color: 'green', label: 'Đang áp dụng' };
    case PriceStatus.EXPIRED:
      return { color: 'red', label: 'Đã hết hạn' };
    case PriceStatus.PAUSED:
      return { color: 'orange', label: 'Tạm dừng' };
    default:
      return { color: 'default', label: 'Không xác định' };
  }
};

export const useHook = () => {
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const { modal } = useModal();
  const { mutateAsync: deletePriceDetail } = usePriceDelete();
  const { notify } = useNotification();
  const columns: ITableProps<
    IPriceListResponse['data']['content'][number]
  >['columns'] = [
    {
      key: 'id',
      title: 'STT',
      fixed: 'left',
      align: 'center',
      width: 60,
      render: (_, __, index) =>
        index + 1 + queryParams.page * queryParams.limit,
    },
    {
      key: 'priceName',
      title: 'Tên bảng giá',
      width: 120,
      render: (_, record) => record?.priceName,
    },
    {
      key: 'priceCode',
      title: 'Mã bảng giá',
      width: 120,
      render: (_, record) => record?.priceCode,
    },
    {
      key: 'startDate',
      title: 'Ngày bắt đầu',
      width: 120,
      render: (_, record) =>
        record.startDate ? formatDate(record.startDate) : '',
    },
    {
      key: 'endDate',
      title: 'Ngày kết thúc',
      width: 120,
      render: (_, record) => (record.endDate ? formatDate(record.endDate) : ''),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        const { color, label } = getStatusColorLabel(record.status);
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        // if (record.status !== PriceStatus.UPCOMING) return null; // chỉ hiện khi UPCOMING
        return (
          <Flex gap={8} style={{ display: 'inline-flex' }}>
            <div onClick={(e) => e.stopPropagation()}>
              <UpdatePriceModal record={record} />
            </div>
            <Button
              type="text"
              icon={<SvgTrashIcon width={18} height={18} />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete([record?.priceId], record);
              }}
            />
          </Flex>
        );
      },
    },
  ];

  const handleDelete = (
    ids: number[],
    record?: IPriceListResponse['data']['content'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa bảng giá`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các bảng giá này không?`
      : `Bạn có chắc chắn muốn xóa bảng giá ${record?.priceName} này không?`;

    modal('confirm', {
      title,
      content,
      onOk: async () => {
        try {
          await deletePriceDetail(
            {
              ids,
            },
            {
              onSuccess: () => {
                notify('success', {
                  message: 'Thành công',
                  description: 'Xóa bảng giá thành công',
                });

                queryClient.invalidateQueries({
                  queryKey: priceKeys.lists(),
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
