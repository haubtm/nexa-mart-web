import { formatDate, type ITableProps } from '@/lib';
import { useCommonHook } from '@/features/main/containers/Transaction/hook';
import { IWarehouseListResponse } from '@/dtos';

export const useHook = () => {
  const { queryParams } = useCommonHook();

  const columns: ITableProps<
    IWarehouseListResponse['data']['content'][number]
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
      key: 'productName',
      title: 'Tên sản phẩm',
      fixed: 'left',
      width: 120,
      render: (_, record) => record?.productUnit?.productName,
    },
    {
      key: 'barcode',
      title: 'Mã vạch',
      width: 120,
      render: (_, record) => record?.productUnit?.barcode,
    },
    {
      key: 'unit',
      title: 'Đơn vị tính',
      width: 120,
      render: (_, record) => record?.productUnit?.unit,
    },
    {
      key: 'quantityOnHand',
      title: 'Số lượng tồn',
      width: 120,
      render: (_, record) => record?.quantityOnHand,
    },
    {
      key: 'updatedAt',
      title: 'Ngày cập nhật',
      width: 120,
      render: (_, record) => formatDate(record?.updatedAt),
    },
  ];

  return {
    columns,
  };
};
