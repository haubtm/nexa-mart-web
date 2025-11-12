import { Flex, formatDate, type ITableProps } from '@/lib';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/StockTake/hook';
import type { IStockTakeListResponse } from '@/dtos';
import { Tag } from 'antd';
import UpdateStockTakeModal from '../UpdateStockTakeModal';

export const useHook = () => {
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    IStockTakeListResponse['data']['content'][number]
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
      key: 'stocktakeCode',
      title: 'Mã kiểm kho',
      width: 120,
      render: (_, record) => record?.stocktakeCode,
    },
    {
      key: 'createdAt',
      title: 'Ngày tạo',
      width: 120,
      render: (_, record) => formatDate(record?.createdAt),
    },
    {
      key: 'status',
      title: 'Trạng thái',
      width: 120,
      render: (_, record) => (
        <Tag color={record?.status === 'COMPLETED' ? 'green' : 'blue'}>
          {record?.status === 'COMPLETED' ? 'Hoàn thành' : 'Đang chờ'}
        </Tag>
      ),
    },
    {
      key: 'updatedAt',
      title: 'Ngày cập nhật',
      width: 120,
      render: (_, record) => formatDate(record?.updatedAt),
    },
    {
      key: 'note',
      title: 'Ghi chú',
      width: 120,
      render: (_, record) => record?.notes,
    },
    {
      key: 'action',
      width: 60,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Flex gap={8}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <UpdateStockTakeModal record={record} />
          </div>
          {/* <Button
            type="text"
            icon={<SvgTrashIcon width={18} height={18} />}
            onClick={(e) => {
              e.stopPropagation();
              // handleDelete([record?.id], record);
            }}
          /> */}
        </Flex>
      ),
    },
  ];

  return {
    columns,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
