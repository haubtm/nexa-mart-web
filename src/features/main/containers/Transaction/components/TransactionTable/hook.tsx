import { ETransaction, formatDate, type ITableProps } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Transaction/hook';
import type { IWarehouseTransactionResponse } from '@/dtos';
import { Tag } from 'antd';

export const useHook = () => {
  const { queryParams } = useCommonHook();

  const getTransactionTypeColorAndLabel = (type: ETransaction) => {
    switch (type) {
      case ETransaction.ADJUSTMENT:
        return { color: 'green', label: 'Kiểm kho' };
      case ETransaction.RETURN:
        return { color: 'blue', label: 'Trả hàng' };
      case ETransaction.SALE:
        return { color: 'red', label: 'Bán hàng' };
      case ETransaction.STOCK_IN:
        return { color: 'purple', label: 'Nhập kho' };
      default:
        return { color: 'gray', label: 'Khác' };
    }
  };

  const columns: ITableProps<
    IWarehouseTransactionResponse['data']['content'][number]
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
      key: 'referenceId',
      title: 'Mã giao dịch',
      width: 120,
      render: (_, record) => record?.referenceId,
    },
    {
      key: 'variantName',
      title: 'Tên biến thể',
      width: 120,
      render: (_, record) => record?.variant?.variantName,
    },
    {
      key: 'variantCode',
      title: 'Mã biến thể',
      width: 120,
      render: (_, record) => record?.variant?.variantCode,
    },
    {
      key: 'unit',
      title: 'Đơn vị tính',
      width: 120,
      render: (_, record) => record?.variant?.unit,
    },
    {
      key: 'transactionDate',
      title: 'Ngày giao dịch',
      width: 120,
      render: (_, record) => formatDate(record?.transactionDate),
    },
    {
      key: 'transactionType',
      title: 'Loại giao dịch',
      width: 120,
      render: (_, record) => {
        const { color, label } = getTransactionTypeColorAndLabel(
          record?.transactionType,
        );
        return <Tag color={color}>{label}</Tag>;
      },
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
  };
};
