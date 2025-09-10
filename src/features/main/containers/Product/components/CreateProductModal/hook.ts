import type { IProductCreateRequest } from '@/dtos';
import { productKeys, useProductCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IProductCreateRequest>();
  const { mutateAsync: createRoom, isPending: isLoadingCreateRoom } =
    useProductCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IProductCreateRequest) => {
    return await createRoom(
      {
        name: values.name,
        additionalUnits: values.additionalUnits,
        attributes: values.attributes,
        baseUnit: values.baseUnit,
        categoryId: values.categoryId,
        inventory: values.inventory,
        productType: values.productType,
        allowsSale: values.allowsSale || true,
        description: values.description,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm sản phẩm thành công',
          });

          queryClient.invalidateQueries({
            queryKey: productKeys.all,
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
    isLoadingCreateRoom,
    handleSubmit,
    handleCancel,
  };
};
