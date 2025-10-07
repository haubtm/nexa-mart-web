import type { IStockTakeCreateRequest, IStockTakeListResponse } from '@/dtos';
import { stockTakeKeys, useStockTakeUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = (
  record?: IStockTakeListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IStockTakeCreateRequest>();
  const { mutateAsync: updateStockTake, isPending: isLoadingUpdateStockTake } =
    useStockTakeUpdate();
  const { notify } = useNotification();

  const handleCancel = () => {
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IStockTakeCreateRequest) => {
    if (!record) return;

    await updateStockTake(
      {
        stocktakeId: record.stocktakeId,
        status: values.status,
        notes: values.notes,
        stocktakeDetails: values.stocktakeDetails ?? [],
      } as any,
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description:
              record?.status === 'COMPLETED'
                ? 'Hoàn thành phiếu kiểm kê'
                : 'Lưu tạm phiếu kiểm kê',
          });
          queryClient.invalidateQueries({ queryKey: stockTakeKeys.all });
        },
      },
    );

    handleCancel();
  };

  const handleOpen = async () => {
    ref?.current?.open();

    // Lấy chi tiết mới nhất
    const normalized = (record?.stocktakeDetails ?? []).map((d: any) => ({
      productUnitId: d.productUnitId ?? d.productUnit?.productUnitId,
      quantityCounted: d.quantityCounted ?? 0,
      reason: d.reason ?? undefined,
      quantityExpected: d.quantityExpected ?? 0, // ⬅️ thêm dòng này
    }));

    form.setFieldsValue({
      stocktakeCode: record?.stocktakeCode,
      notes: record?.notes,
      status: record?.status,
      stocktakeDetails: normalized,
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
