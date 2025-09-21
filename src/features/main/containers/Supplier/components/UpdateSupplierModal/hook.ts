import type { ISupplierCreateRequest, ISupplierListResponse } from '@/dtos';
import { supplierKeys, useSupplierUpdate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?: ISupplierListResponse['data']['content'][number] | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ISupplierCreateRequest>();
  const { mutateAsync: updateSupplier, isPending: isLoadingUpdateSupplier } =
    useSupplierUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: ISupplierCreateRequest) => {
    if (!record) {
      return;
    }

    await updateSupplier(
      {
        id: record.supplierId,
        email: record.email,
        name: values.name,
        address: values.address,
        phone: values.phone,
        isActive: values.isActive,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật thông tin nhà cung cấp thành công',
          });

          queryClient.invalidateQueries({
            queryKey: supplierKeys.all,
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
    isLoadingUpdateSupplier,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
