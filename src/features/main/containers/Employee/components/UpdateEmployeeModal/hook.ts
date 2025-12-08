import type { IEmployeeCreateRequest, IEmployeeListResponse } from '@/dtos';
import { employeeKeys, useEmployeeUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';
import dayjs from 'dayjs';

const toDateStr = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.format('YYYY-MM-DD');
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD');
  return v;
};

export const useHook = (
  record?: IEmployeeListResponse['data']['employees'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IEmployeeCreateRequest>();
  const { mutateAsync: updateEmployee, isPending: isLoadingUpdateEmployee } =
    useEmployeeUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IEmployeeCreateRequest) => {
    if (!record) {
      return;
    }

    await updateEmployee(
      {
        id: record.employeeId,
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
            description: 'Cập nhật thông tin nhân viên thành công',
          });

          queryClient.invalidateQueries({
            queryKey: employeeKeys.all,
          });
        },
      },
    );

    handleCancel();
  };

  const handleOpen = () => {
    ref?.current?.open();
    form.setFieldsValue({
      ...record,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdateEmployee,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
