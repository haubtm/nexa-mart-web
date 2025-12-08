import { Form, type IModalRef } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { productKeys, useProductImport } from '@/features/main/react-query';
import { useRef, useState } from 'react';
import { message, type UploadFile } from 'antd';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { mutate: importProduct, isPending: isImporting } = useProductImport();

  const handleOpen = () => {
    ref.current?.open();
  };

  const handleCancel = () => {
    form.resetFields();
    setFileList([]);
    ref.current?.hide();
  };

  const handleSubmit = async () => {
    if (fileList.length === 0) {
      message.error('Vui lòng chọn file Excel');
      return;
    }

    const file = fileList[0].originFileObj;
    if (!file) {
      message.error('File không hợp lệ');
      return;
    }

    importProduct(
      { file },
      {
        onSuccess: () => {
          message.success('Import sản phẩm thành công');
          queryClient.invalidateQueries({ queryKey: productKeys.all });
          handleCancel();
        },
        onError: (error: any) => {
          message.error(error?.message || 'Có lỗi xảy ra khi import');
        },
      },
    );
  };

  return {
    ref,
    form,
    fileList,
    setFileList,
    isImporting,
    handleOpen,
    handleCancel,
    handleSubmit,
  };
};
