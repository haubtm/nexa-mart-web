import { ICategoryCreateRequest } from '@/dtos';
import {
  categoryKeys,
  useCategoryCreate,
  useCategoryRootList,
} from '@/features/main/react-query';
import { Form, IModalRef, useNotification } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { queryClient } from '@/providers/ReactQuery';
import { useMemo, useRef } from 'react';
import { z } from 'zod';

export const useHook = () => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<ICategoryCreateRequest>();
  const { mutateAsync: createCategory, isPending: isLoadingCreateCategory } =
    useCategoryCreate();
  const { notify } = useNotification();
  const handleCancel = () => {
    form.resetFields();
    ref?.current?.hide();
  };
  const { data: categories, isLoading: isLoadingCategories } =
    useCategoryRootList();

  const handleSubmit = async (values: ICategoryCreateRequest) => {
    await createCategory(
      {
        name: values?.name,
        parentId: values?.parentId,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Thêm khối thành công',
          });

          queryClient.invalidateQueries({
            queryKey: categoryKeys.all,
          });
          handleCancel();
        },
        onError: (error) => {
          notify('error', {
            message: 'Thất bại',
            description:
              error?.message ||
              'Có lỗi xảy ra khi cập nhật khối lớp, vui lòng thử lại sau',
          });
        },
      },
    );
  };

  const submitForm = (values: ICategoryCreateRequest) => {
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
      parentId: z
        .number('Danh mục cha phải là số')
        .min(1, 'Danh mục cha không được nhỏ hơn 1')
        .optional(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  return {
    ref,
    form,
    isLoadingCreateCategory,
    handleCancel,
    rules,
    submitForm,
    categories,
    isLoadingCategories,
  };
};
