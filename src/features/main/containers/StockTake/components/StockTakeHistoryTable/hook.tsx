import { formatDate, type ITableProps } from '@/lib';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/StockTake/hook';
import type { IInventoryHistoryResponse } from '@/dtos';

export const useHook = () => {
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    IInventoryHistoryResponse['data']['content'][number]
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
      key: 'referenceId',
      title: 'Mã kiểm kho',
      width: 120,
      render: (_, record) => record?.referenceId,
    },
    {
      key: 'time',
      title: 'Thời gian',
      width: 130,
      render: (_, record) => formatDate(record?.time),
    },
    {
      key: 'actualQuantity',
      title: 'SL thực tế',
      width: 120,
      render: (_, record) => record?.actualQuantity,
    },
    {
      key: 'totalDifference',
      title: 'Tổng chênh lệch',
      width: 120,
      render: (_, record) => record?.totalDifference,
    },
    {
      key: 'increaseQuantity',
      title: 'SL tăng',
      width: 120,
      render: (_, record) => record?.increaseQuantity,
    },
    {
      key: 'decreaseQuantity',
      title: 'SL giảm',
      width: 120,
      render: (_, record) => record?.decreaseQuantity,
    },
    {
      key: 'note',
      title: 'Ghi chú',
      width: 120,
      render: (_, record) => record?.note,
    },
  ];

  return {
    columns,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
