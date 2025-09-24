import type { IPriceCreateRequest, IPriceListResponse } from '@/dtos';
import { priceKeys, usePriceUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?: IPriceListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPriceCreateRequest>();
  const { mutateAsync: updatePrice, isPending: isLoadingUpdatePrice } =
    usePriceUpdate();
  const { notify } = useNotification();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPriceCreateRequest) => {
    if (!record) {
      return;
    }

    return await updatePrice(
      {
        priceId: record.priceId,
        priceName: values.priceName,
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
        priceDetails: values?.priceDetails,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật bảng giá thành công',
          });

          queryClient.invalidateQueries({
            queryKey: priceKeys.all,
          });
          handleCancel();
        },
      },
    );
  };

  const handleOpen = () => {
    if (!record) return;

    ref?.current?.open();

    form.setFieldsValue({
      priceName: record.priceName,
      priceCode: record.priceCode,
      startDate: record.startDate
        ? dayjs.tz(record.startDate, VN_TZ)
        : undefined,
      endDate: record.endDate ? dayjs.tz(record.endDate, VN_TZ) : undefined,
      description: record.description,
      // chỉ cần variantId + salePrice (đúng shape IPriceCreateRequest)
      priceDetails:
        record.priceDetails?.map((d) => ({
          variantId: d.variantId,
          salePrice: d.salePrice,
          variantCode: d.variantCode,
          variantName: d.variantName,
        })) ?? [],
    });
  };

  return {
    ref,
    form,
    isLoadingUpdatePrice,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
