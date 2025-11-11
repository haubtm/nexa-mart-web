import type { IPromotionLineCreateRequest } from '@/dtos';
import {
  promotionKeys,
  usePromotionLineCreate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = (headerId: number) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionLineCreateRequest>();
  const { mutateAsync: createPromotion, isPending: isLoadingCreatePromotion } =
    usePromotionLineCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionLineCreateRequest) => {
    await createPromotion(
      {
        promotionType: values.promotionType,
        description: values.description,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        headerId: headerId,
        lineName: values.lineName,
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
          console.log(error);
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
