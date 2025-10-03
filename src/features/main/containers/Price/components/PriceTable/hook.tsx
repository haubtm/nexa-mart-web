import { Flex, formatDate, PriceStatus, type ITableProps } from '@/lib';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/Price/hook';
import type { IPriceListResponse } from '@/dtos';
import UpdatePriceModal from '../UpdatePriceModal';
import { Tag } from 'antd';

const getStatusColorLabel = (status: string) => {
  switch (status) {
    case PriceStatus.CURRENT:
      return { color: 'blue', label: 'Đang áp dụng' };
    case PriceStatus.UPCOMING:
      return { color: 'green', label: 'Sắp áp dụng' };
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
          </Flex>
        );
      },
    },
  ];

  return {
    columns,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
