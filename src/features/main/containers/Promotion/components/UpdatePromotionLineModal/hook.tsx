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
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';
const toIsoUTCZ = (v?: any) =>
  v ? dayjs(v).tz(VN_TZ).toDate().toISOString() : v;

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
        promotionCode: values.promotionCode,
        promotionType: values.promotionType,
        description: values.description,
        maxUsagePerCustomer: values?.maxUsagePerCustomer,
        maxUsageTotal: values?.maxUsageTotal,
        startDate: toIsoUTCZ(values.startDate),
        endDate: toIsoUTCZ(values.endDate),
        status: values.status,
        // ❌ Không gửi `detail` ở update line
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
      startDate: record?.startDate
        ? dayjs.tz(record.startDate, VN_TZ)
        : undefined,
      endDate: record?.endDate ? dayjs.tz(record.endDate, VN_TZ) : undefined,
      // ❌ Không set `detail` vào form của line
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
