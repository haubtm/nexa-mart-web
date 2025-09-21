import type { ISupplierCreateRequest } from '@/dtos';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: ISupplierCreateRequest) => void,
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      code: z
        .string('Mã nhà cung cấp phải là chuỗi ký tự')
        .nonempty('Mã nhà cung cấp không được để trống')
        .trim(),
      name: z
        .string('Tên nhà cung cấp phải là chuỗi ký tự')
        .nonempty('Tên nhà cung cấp không được để trống')
        .trim(),
      email: z
        .string('Email nhà cung cấp phải là chuỗi ký tự')
        .nonempty('Email nhà cung cấp không được để trống')
        .email('Email nhà cung cấp không hợp lệ')
        .trim(),
      address: z
        .string('Địa chỉ nhà cung cấp phải là chuỗi ký tự')
        .nonempty('Địa chỉ nhà cung cấp không được để trống')
        .trim(),
      phone: z
        .string('Số điện thoại nhà cung cấp phải là chuỗi ký tự')
        .nonempty('Số điện thoại nhà cung cấp không được để trống')
        .trim(),
      isActive: z
        .boolean('Trạng thái hoạt động phải là kiểu boolean')
        .optional(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  const onFinish = (values: ISupplierCreateRequest) => {
    try {
      const parsedValues = Schema.parse(values);

      handleSubmit?.(parsedValues as ISupplierCreateRequest);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
  };
};
