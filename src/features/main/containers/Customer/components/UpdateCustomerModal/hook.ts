import type { ICustomerCreateRequest, ICustomerListResponse } from '@/dtos';
import { customerKeys, useCustomerUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import dayjs from 'dayjs';
import { type MouseEvent, useRef } from 'react';

interface ICustomerFormValues extends ICustomerCreateRequest {
  addressDetail?: string;
  wardCode?: string | number;
  provinceCode?: string | number;
}

export const useHook = (
  record?: ICustomerListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ICustomerFormValues>();
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

    // Parse address from format: "addressDetail, wardCode, wardName, provinceCode, provinceName"
    const addressParts = record?.address ? record.address.split(', ') : [];
    const addressDetail = addressParts[0] || '';
    const wardCode = addressParts[1] ? Number(addressParts[1]) : undefined;
    const provinceCode = addressParts[3] ? Number(addressParts[3]) : undefined;

    form.setFieldsValue({
      name: record?.name,
      email: record?.email,
      phone: record?.phone,
      customerCode: record?.customerCode,
      addressDetail,
      wardCode,
      provinceCode,
      gender: record?.gender,
      customerType: record?.customerType,
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
