import type { ISupplierCreateRequest } from '@/dtos';
import { supplierKeys, useSupplierCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ISupplierCreateRequest>();
  const { mutateAsync: createRoom, isPending: isLoadingCreateRoom } =
    useSupplierCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: ISupplierCreateRequest) => {
    await createRoom(
      {
        name: values.name,
        email: values.email,
        address: values.address,
        phone: values.phone,
        isActive: values.isActive,
        code: values.code,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm nhà cung cấp thành công',
          });

          queryClient.invalidateQueries({
            queryKey: supplierKeys.all,
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
