import type { IPriceCreateRequest } from '@/dtos';
import { priceKeys, usePriceCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPriceCreateRequest>();
  const { mutateAsync: createPrice, isPending: isLoadingCreatePrice } =
    usePriceCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.setFieldsValue({ priceDetails: [] });
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPriceCreateRequest) => {
    console.log('values', values);
    await createPrice(
      {
        priceName: values.priceName,
        priceCode: values.priceCode,
        startDate: values.startDate,
        endDate: values.endDate,
        description: values.description,
        priceDetails: values.priceDetails,
        status: values.status,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm bảng giá thành công',
          });

          queryClient.invalidateQueries({
            queryKey: priceKeys.all,
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
    isLoadingCreatePrice,
    handleSubmit,
    handleCancel,
  };
};
