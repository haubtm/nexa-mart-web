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
      key: 'productName',
      title: 'Tên sản phẩm',
      width: 160,
      render: (_, record) => record?.productUnit?.productName,
    },
    {
      key: 'unit',
      title: 'Đơn vị tính',
      width: 100,
      render: (_, record) => record?.productUnit?.unit,
    },
    {
      key: 'beforeQuantity',
      title: 'Số dư trước',
      align: 'right',
      width: 100,
      render: (_, record) => record?.beforeQuantity?.toLocaleString() ?? 0,
    },
    {
      key: 'quantityChange',
      title: 'Thay đổi',
      align: 'right',
      width: 100,
      render: (_, record) => {
        const value = record?.quantityChange ?? 0;
        const color = value > 0 ? 'green' : value < 0 ? 'red' : 'gray';
        const sign = value > 0 ? '+' : '';
        return <span style={{ color }}>{`${sign}${value}`}</span>;
      },
    },
    {
      key: 'newQuantity',
      title: 'Số dư hiện tại',
      align: 'right',
      width: 100,
      render: (_, record) => record?.newQuantity?.toLocaleString() ?? 0,
    },
    {
      key: 'transactionDate',
      title: 'Ngày giao dịch',
      width: 150,
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
      width: 200,
      render: (_, record) => record?.notes,
    },
  ];

  return {
    columns,
  };
};
