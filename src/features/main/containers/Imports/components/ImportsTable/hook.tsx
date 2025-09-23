import { formatDate, type ITableProps } from '@/lib';
import { useState } from 'react';
import { useCommonHook } from '@/features/main/containers/Imports/hook';
import type { IImportsListResponse } from '@/dtos';

export const useHook = () => {
  const { queryParams } = useCommonHook();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  const columns: ITableProps<
    IImportsListResponse['data']['content'][number]
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
      key: 'importCode',
      title: 'Mã phiếu nhập',
      width: 120,
      render: (_, record) => record?.importCode,
    },
    {
      key: 'supplierName',
      title: 'Nhà cung cấp',
      width: 120,
      render: (_, record) => record?.supplier?.name,
    },
    {
      key: 'totalQuantity',
      title: 'Tổng số lượng',
      width: 120,
      render: (_, record) => record?.totalQuantity,
    },
    {
      key: 'totalVariants',
      title: 'Tổng sản phẩm',
      width: 120,
      render: (_, record) => record?.totalVariants,
    },
    {
      key: 'importDate',
      title: 'Ngày nhập',
      width: 120,
      render: (_, record) => formatDate(record?.importDate),
    },
    {
      key: 'note',
      title: 'Ghi chú',
      width: 120,
      render: (_, record) => record?.notes,
    },
  ];

  return {
    columns,
    selectedRowKeys,
    setSelectedRowKeys,
  };
};
