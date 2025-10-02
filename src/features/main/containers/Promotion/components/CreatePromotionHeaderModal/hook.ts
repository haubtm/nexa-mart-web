import type { IPromotionHeaderCreateRequest } from '@/dtos';
import {
  promotionKeys,
  usePromotionHeaderCreate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionHeaderCreateRequest>();
  const {
    mutateAsync: createPromotionHeader,
    isPending: isLoadingCreatePromotionHeader,
  } = usePromotionHeaderCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionHeaderCreateRequest) => {
    console.log('values', values);
    await createPromotionHeader(
      {
        promotionName: values.promotionName,
        description: values.description,
        status: values.status,
        startDate: values.startDate,
        endDate: values.endDate,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm chương trình khuyến mãi thành công',
          });

          queryClient.invalidateQueries({
            queryKey: promotionKeys.all,
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
    isLoadingCreatePromotionHeader,
    handleSubmit,
    handleCancel,
  };
};
