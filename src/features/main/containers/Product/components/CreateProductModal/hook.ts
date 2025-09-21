// useHook.ts
import type { IProductCreateRequest } from '@/dtos';
import { productKeys, useProductCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: createProduct, isPending: isLoadingCreateRoom } =
    useProductCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IProductCreateRequest) => {
    // đảm bảo variants đã được “commit” vào form (trường hợp modal thiết lập vừa set)
    console.log('Submitted values: ', values);
    try {
      await form?.validateFields?.(['variants']);
    } catch (error) {
      // ignore; nếu productType không yêu cầu variants thì vẫn submit được
      console.error(error);
    }

    const variants = values?.variants;

    // build payload đúng theo DTO mới
    const payload: IProductCreateRequest = {
      name: values.name,
      categoryId: Number(values.categoryId),
      brandId: Number(values.brandId),
      variants:
        Array.isArray(variants) && variants.length > 0 ? variants : undefined,
      description: values.description || '',
    };

    return await createProduct(payload, {
      onSuccess: () => {
        notify('success', {
          message: 'Thành công',
          description: 'Thêm sản phẩm thành công',
        });

        queryClient.invalidateQueries({ queryKey: productKeys.all });
        handleCancel();
      },
      onError: (error: any) => {
        notify('error', {
          message: 'Thất bại',
          description: error?.message || 'Có lỗi xảy ra',
        });
      },
    });
  };

  return {
    ref,
    form,
    isLoadingCreateRoom,
    handleSubmit,
    handleCancel,
  };
};
