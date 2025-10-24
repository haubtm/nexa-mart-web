import type { IPromotionDetailCreateRequest } from '@/dtos';
import {
  promotionKeys,
  usePromotionDetailCreate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = (lineId: number) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionDetailCreateRequest>();
  const { mutateAsync: createPromotion, isPending: isLoadingCreatePromotion } =
    usePromotionDetailCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionDetailCreateRequest) => {
    await createPromotion(
      {
        ...values,
        giftQuantity: values.giftMaxQuantity || undefined,
        lineId: lineId,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm chi tiết khuyến mãi thành công',
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
    isLoadingCreatePromotion,
    handleSubmit,
    handleCancel,
  };
};
