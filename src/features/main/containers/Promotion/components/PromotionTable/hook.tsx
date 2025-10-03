import { SvgTrashIcon } from '@/assets';
import { promotionKeys, usePromotionDelete } from '@/features/main/react-query';
import {
  Button,
  EPromotionStatus,
  Flex,
  formatDate,
  type ITableProps,
  useModal,
  useNotification,
} from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useState } from 'react';
import type { IPromotionListResponse } from '@/dtos';
import CreatePromotionModal from '../CreatePromotionLineModal';
import UpdatePromotionHeaderModal from '../UpdatePromotionHeaderModal';
import { Tag } from 'antd';

export const useHook = () => {
  const { notify } = useNotification();
  const { modal } = useModal();
  const { mutateAsync: deleteBranches } = usePromotionDelete();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const getStatusTag = (status: EPromotionStatus) => {
    switch (status) {
      case EPromotionStatus.ACTIVE:
        return { label: 'Đang hoạt động', color: 'green' };
      case EPromotionStatus.PAUSED:
        return { label: 'Tạm dừng', color: 'orange' };
      case EPromotionStatus.EXPIRED:
        return { label: 'Hết hạn', color: 'red' };
      case EPromotionStatus.UPCOMING:
        return { label: 'Sắp diễn ra', color: 'blue' };
      case EPromotionStatus.CANCELLED:
        return { label: 'Đã hủy', color: 'darkred' };
      default:
        return status;
    }
  };

  const columns: ITableProps<
    IPromotionListResponse['data']['content'][number]
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
      title: 'Tên chương trình',
      fixed: 'left',
      width: 220,
      render: (_, record) => record?.promotionName,
    },
    {
      key: 'start',
      title: 'Bắt đầu',
      width: 160,
      render: (_, record) => formatDate(record?.startDate),
    },
    {
      key: 'end',
      title: 'Kết thúc',
      width: 160,
      render: (_, record) => formatDate(record?.endDate),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => {
        const tag = getStatusTag(record?.status);
        return <Tag color={tag.color}>{tag.label}</Tag>;
      },
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
      width: 130,
      render: (_, record) => formatDate(record?.updatedAt),
    },
    {
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      render: (_, record) => {
        return (
          <Flex gap={8} style={{ display: 'inline-flex' }}>
            <div onClick={(e) => e.stopPropagation()}>
              <CreatePromotionModal
                headerId={record?.promotionId}
                headerStartDate={record?.startDate}
                headerEndDate={record?.endDate}
              />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <UpdatePromotionHeaderModal record={record} />
            </div>
            <Button
              type="text"
              icon={<SvgTrashIcon width={18} height={18} />}
              onClick={(e) => {
                e.stopPropagation();
                handleDelete([record?.promotionId], record);
              }}
            />
          </Flex>
        );
      },
    },
  ];

  const handleDelete = (
    ids: number[],
    record?: IPromotionListResponse['data']['content'][number],
  ) => {
    const isDeleteSelected = !record;

    const title = `Xóa chương trình khuyến mãi`;
    const content = isDeleteSelected
      ? `Bạn có chắc chắn muốn xóa các chương trình này không?`
      : `Bạn có chắc chắn muốn xóa chương trình ${record?.promotionName} này không?`;

    modal('confirm', {
      title,
      content,
      onOk: async () => {
        try {
          await deleteBranches(
            { ids },
            {
              onSuccess: () => {
                notify('success', {
                  message: 'Thành công',
                  description: 'Xóa chương trình thành công',
                });
                queryClient.invalidateQueries({
                  queryKey: promotionKeys.lists(),
                  refetchType: 'all',
                });
                if (isDeleteSelected) setSelectedRowKeys([]);
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
