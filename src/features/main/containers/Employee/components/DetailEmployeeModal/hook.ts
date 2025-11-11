import type { IEmployeeCreateRequest, IEmployeeListResponse } from '@/dtos';
import { Form, type IModalRef } from '@/lib';
import { type MouseEvent, useEffect } from 'react';

export const useHook = (
  record?: IEmployeeListResponse['data']['employees'][number],
  ref?: React.RefObject<IModalRef | null>,
) => {
  useEffect(() => {
    form.setFieldsValue({
      ...record,
    });
  }, [record]);

  const [form] = Form.useForm<IEmployeeCreateRequest>();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    ref?.current?.hide();
  };

  return {
    form,
    handleCancel,
  };
};
