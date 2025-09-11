import { IAttributeCreateRequest } from '@/dtos';
import { attributeKeys, useAttributeCreate } from '@/features/main/react-query';
import { Form, IModalRef, useNotification } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { queryClient } from '@/providers/ReactQuery';
import { useMemo, useRef } from 'react';
import { z } from 'zod';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IAttributeCreateRequest>();
  const { mutateAsync: createAttribute, isPending: isLoadingCreateAttribute } =
    useAttributeCreate();
  const { notify } = useNotification();
  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IAttributeCreateRequest) => {
    await createAttribute(
      {
        name: values?.name,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm thuộc tính thành công',
          });

          queryClient.invalidateQueries({
            queryKey: attributeKeys.all,
          });
          handleCancel();
        },
        onError: (error) => {
          notify('error', {
            message: 'Thất bại',
            description:
              error?.message ||
              'Có lỗi xảy ra khi tạo thuộc tính, vui lòng thử lại sau',
          });
        },
      },
    );
  };

  const submitForm = (values: IAttributeCreateRequest) => {
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
    isLoadingCreateAttribute,
    handleCancel,
    rules,
    submitForm,
  };
};
