import type { IEmployeeCreateRequest } from '@/dtos';
import { employeeKeys, useEmployeeCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IEmployeeCreateRequest>();
  const { mutateAsync: createRoom, isPending: isLoadingCreateRoom } =
    useEmployeeCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IEmployeeCreateRequest) => {
    await createRoom(
      {
        name: values.name,
        email: values.email,
        role: values.role,
        passwordHash: values.passwordHash,
        createdAt: values.createdAt,
        updatedAt: values.updatedAt,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm nhân viên thành công',
          });

          queryClient.invalidateQueries({
            queryKey: employeeKeys.all,
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
