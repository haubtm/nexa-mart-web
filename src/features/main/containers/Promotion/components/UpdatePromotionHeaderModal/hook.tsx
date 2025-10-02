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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

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
    if (!record) {
      return;
    }

    await updatePromotionHeader(
      {
        promotionId: record.promotionId,
        promotionName: values.promotionName,
        description: values.description,
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

          queryClient.invalidateQueries({
            queryKey: promotionKeys.all,
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
      startDate: record?.startDate
        ? dayjs.tz(record.startDate, VN_TZ)
        : undefined,
      endDate: record?.endDate ? dayjs.tz(record.endDate, VN_TZ) : undefined,
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
