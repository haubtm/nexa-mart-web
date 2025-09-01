import type { IEmployeeCreateRequest } from '@/dtos';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: IEmployeeCreateRequest) => void,
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      name: z
        .string('Tên không được để trống')
        .nonempty('Tên không được để trống')
        .trim(),
      email: z
        .string('Email không được để trống')
        .nonempty('Email không được để trống')
        .email('Email không hợp lệ')
        .trim(),
      passwordHash: z
        .string('Mật khẩu không được để trống')
        .nonempty('Mật khẩu không được để trống')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .trim(),
      role: z
        .string('Vai trò không được để trống')
        .nonempty('Vai trò không được để trống'),
      createAt: z.optional(z.string().trim()).default(new Date().toISOString()),
      updateAt: z.optional(z.string().trim()).default(new Date().toISOString()),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  const onFinish = (values: IEmployeeCreateRequest) => {
    try {
      const parsedValues = Schema.parse(values);

      handleSubmit?.(parsedValues as IEmployeeCreateRequest);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
  };
};
