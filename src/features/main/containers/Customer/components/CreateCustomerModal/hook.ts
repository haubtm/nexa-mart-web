import type { ICustomerCreateRequest } from '@/dtos';
import { customerKeys, useCustomerCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ICustomerCreateRequest>();
  const { mutateAsync: createRoom, isPending: isLoadingCreateRoom } =
    useCustomerCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: ICustomerCreateRequest) => {
    await createRoom(
      {
        name: values.name,
        email: values.email,
        address: values.address,
        phone: values.phone,
        dateOfBirth: values.dateOfBirth,
        customerType: values.customerType,
        gender: values.gender,
        customerCode: values.customerCode,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm khách hàng thành công',
          });

          queryClient.invalidateQueries({
            queryKey: customerKeys.all,
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
