import type { IProductCreateRequest, IProductListResponse } from '@/dtos';
import { Form, type IModalRef } from '@/lib';
import { type MouseEvent, useEffect } from 'react';

export const useHook = (
  record?: IProductListResponse['data']['content'][number],
  ref?: React.RefObject<IModalRef | null>,
) => {
  useEffect(() => {
    form.setFieldsValue({
      ...record,
    });
  }, [record]);

  const [form] = Form.useForm<IProductCreateRequest>();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();

    ref?.current?.hide();
  };

  return {
    form,
    handleCancel,
  };
};
