import type { IStockTakeCreateRequest } from '@/dtos';
import {
  warehouseKeys,
  stockTakeKeys,
  useStockTakeCreate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IStockTakeCreateRequest>();
  const { mutateAsync: createRoom, isPending: isLoadingCreateRoom } =
    useStockTakeCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IStockTakeCreateRequest) => {
    await createRoom(
      {
        status: values.status,
        notes: values.notes,
        stocktakeCode: values.stocktakeCode,
        stocktakeDetails: values.stocktakeDetails,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm phiếu kiểm kho thành công',
          });

          queryClient.invalidateQueries({
            queryKey: stockTakeKeys.all,
          });

          queryClient.invalidateQueries({
            queryKey: warehouseKeys.all,
          });

          handleCancel();
        },
        onError: (error) => {
          notify('error', {
            message: 'Thất bại',
            description: error.message || 'Có lỗi xảy ra',
          });
        },
      },
    );
  };

  return {
    ref,
    form,
    isLoadingCreateRoom,
    handleSubmit,
    handleCancel,
  };
};
