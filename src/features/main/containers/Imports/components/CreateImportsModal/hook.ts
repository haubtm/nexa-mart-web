import type { IImportsCreateRequest } from '@/dtos';
import { importsKeys, useImportsCreate } from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { useRef } from 'react';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IImportsCreateRequest>();
  const { mutateAsync: createImport, isPending: isLoadingCreateImport } =
    useImportsCreate();
  const { notify } = useNotification();

  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IImportsCreateRequest) => {
    await createImport(
      {
        importCode: values.importCode,
        supplierId: values.supplierId,
        notes: values.notes,
        importDetails: values.importDetails,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm phiếu nhập hàng thành công',
          });

          queryClient.invalidateQueries({
            queryKey: importsKeys.all,
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
    isLoadingCreateImport,
    handleSubmit,
    handleCancel,
  };
};
