import type {
  IPromotionLineCreateRequest,
  IPromotionListResponse,
} from '@/dtos';
import {
  promotionKeys,
  usePromotionLineUpdate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';
import dayjs from 'dayjs';

export const useHook = (
  record?:
    | IPromotionListResponse['data']['content'][number]['promotionLines'][number]
    | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionLineCreateRequest>();
  const {
    mutateAsync: updatePromotionLine,
    isPending: isLoadingUpdatePromotionLine,
  } = usePromotionLineUpdate();
  const { notify } = useNotification();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionLineCreateRequest) => {
    if (!record) return;

    await updatePromotionLine(
      {
        lineId: record.promotionLineId,
        // ✅ đổi sang lineName
        lineName: values.lineName,
        promotionType: values.promotionType,
        description: values.description,
        // ✅ gửi chuỗi YYYY-MM-DD
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        // ❌ không gửi usage*, không gửi detail
      } as any,
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật chương trình thành công',
          });
          queryClient.invalidateQueries({ queryKey: promotionKeys.all });
          handleCancel();
        },
        onError: (error: any) => {
          notify('error', { message: 'Thất bại', description: error.message });
        },
      },
    );
  };

  const handleOpen = () => {
    ref?.current?.open();
    form.setFieldsValue({
      ...record,
      // ✅ parse từ YYYY-MM-DD
      startDate: record?.startDate
        ? dayjs(record.startDate, 'YYYY-MM-DD')
        : undefined,
      endDate: record?.endDate
        ? dayjs(record.endDate, 'YYYY-MM-DD')
        : undefined,
      // ❌ không set detail vào form của line
    } as any);
  };

  return {
    ref,
    form,
    isLoadingUpdatePromotionLine,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
