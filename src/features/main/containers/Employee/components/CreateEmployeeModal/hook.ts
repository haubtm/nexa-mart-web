import type { IEmployeeCreateRequest } from '@/dtos';
import { employeeKeys, useEmployeeCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';
import dayjs from 'dayjs';

const toDateStr = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.format('YYYY-MM-DD');
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD');
  return v;
};

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
        phone: values.phone,
        password: values.password,
        role: values.role,
        dateOfBirth: toDateStr(values.dateOfBirth) as string,
        gender: values.gender,
        employeeCode: values.employeeCode,
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
