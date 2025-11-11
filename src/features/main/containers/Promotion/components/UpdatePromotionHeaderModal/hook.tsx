import type {
  IPromotionHeaderCreateRequest,
  IPromotionListResponse,
} from '@/dtos';
import {
  promotionKeys,
  usePromotionHeaderUpdate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';
import dayjs from 'dayjs';

export const useHook = (
  record?: IPromotionListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionHeaderCreateRequest>();
  const {
    mutateAsync: updatePromotionHeader,
    isPending: isLoadingUpdatePromotionHeader,
  } = usePromotionHeaderUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionHeaderCreateRequest) => {
    if (!record) return;

    await updatePromotionHeader(
      {
        promotionId: record.promotionId,
        promotionName: values.promotionName,
        description: values.description,
        // ✅ Gửi chuỗi YYYY-MM-DD (không giờ)
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
      },
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
      // ✅ parse từ YYYY-MM-DD để hiển thị DatePicker (không tz)
      startDate: record?.startDate
        ? dayjs(record.startDate, 'YYYY-MM-DD')
        : undefined,
      endDate: record?.endDate
        ? dayjs(record.endDate, 'YYYY-MM-DD')
        : undefined,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdatePromotionHeader,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
