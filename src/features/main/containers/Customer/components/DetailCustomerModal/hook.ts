import type { ICustomerCreateRequest, ICustomerListResponse } from '@/dtos';
import { Form, type IModalRef } from '@/lib';
import dayjs from 'dayjs';
import { type MouseEvent, useEffect } from 'react';

export const useHook = (
  record?: ICustomerListResponse['data']['content'][number],
  ref?: React.RefObject<IModalRef | null>,
) => {
  useEffect(() => {
    form.setFieldsValue({
      ...record,
      dateOfBirth: record?.dateOfBirth ? dayjs(record.dateOfBirth) : null,
    });
  }, [record]);

  const [form] = Form.useForm<ICustomerCreateRequest>();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    ref?.current?.hide();
  };

  return {
    form,
    handleCancel,
  };
};
