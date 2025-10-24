import type { ICustomerCreateRequest, ICustomerListResponse } from '@/dtos';
import { customerKeys, useCustomerUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import dayjs from 'dayjs';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?: ICustomerListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ICustomerCreateRequest>();
  const { mutateAsync: updateCustomer, isPending: isLoadingUpdateCustomer } =
    useCustomerUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: ICustomerCreateRequest) => {
    if (!record) {
      return;
    }

    await updateCustomer(
      {
        customerId: record.customerId,
        email: record.email,
        name: values.name,
        address: values.address,
        phone: values.phone,
        dateOfBirth: dayjs(values.dateOfBirth).format('YYYY-MM-DD'),
        customerType: values.customerType,
        gender: values.gender,
        customerCode: values.customerCode,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật thông tin khách hàng thành công',
          });

          queryClient.invalidateQueries({
            queryKey: customerKeys.all,
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
      dateOfBirth: record?.dateOfBirth ? dayjs(record.dateOfBirth) : null,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdateCustomer,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
