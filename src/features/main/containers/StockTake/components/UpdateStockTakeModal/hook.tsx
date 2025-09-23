import type { IStockTakeCreateRequest, IStockTakeListResponse } from '@/dtos';
import { stockTakeKeys, useStockTakeUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?: IStockTakeListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IStockTakeCreateRequest>();
  const { mutateAsync: updateStockTake, isPending: isLoadingUpdateStockTake } =
    useStockTakeUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IStockTakeCreateRequest) => {
    if (!record) {
      return;
    }

    await updateStockTake(
      {
        stocktakeId: record.stocktakeId,
        status: values.status,
        notes: values.notes,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật thông tin phiếu kiểm kho thành công',
          });

          queryClient.invalidateQueries({
            queryKey: stockTakeKeys.all,
          });
        },
      },
    );

    handleCancel();
  };

  const handleOpen = () => {
    ref?.current?.open();
    form.setFieldsValue({
      ...record,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdateStockTake,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
