import { IBrandCreateRequest } from '@/dtos';
import { brandKeys, useBrandCreate } from '@/features/main/react-query';
import { Form, IModalRef, useNotification } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { queryClient } from '@/providers/ReactQuery';
import { useMemo, useRef } from 'react';
import { z } from 'zod';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IBrandCreateRequest>();
  const { mutateAsync: createBrand, isPending: isLoadingCreateBrand } =
    useBrandCreate();
  const { notify } = useNotification();
  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IBrandCreateRequest) => {
    await createBrand(
      {
        name: values?.name,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm thương hiệu thành công',
          });

          queryClient.invalidateQueries({
            queryKey: brandKeys.all,
          });
          handleCancel();
        },
        onError: (error) => {
          notify('error', {
            message: 'Thất bại',
            description:
              error?.message ||
              'Có lỗi xảy ra khi tạo thương hiệu, vui lòng thử lại sau',
          });
        },
      },
    );
  };

  const submitForm = (values: IBrandCreateRequest) => {
    try {
      const parsedValues = Schema.parse(values);
      handleSubmit(parsedValues);
    } catch (error) {
      console.error(error);
    }
  };

  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      name: z
        .string('Tên phải là chuỗi')
        .nonempty('Tên không được để trống')
        .trim(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  return {
    ref,
    form,
    isLoadingCreateBrand,
    handleCancel,
    rules,
    submitForm,
  };
};
