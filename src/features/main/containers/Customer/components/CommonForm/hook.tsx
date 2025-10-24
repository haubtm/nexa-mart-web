import type { ICustomerCreateRequest } from '@/dtos';
import { ECustomerType, EGender } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: ICustomerCreateRequest) => void,
) => {
  const [rules, Schema] = useMemo(() => {
    const sixteenYearsAgo = (() => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setFullYear(d.getFullYear() - 16);
      return d;
    })();

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
      phone: z
        .string('Số điện thoại không được để trống')
        .nonempty('Số điện thoại không được để trống')
        .trim(),
      address: z
        .string('Địa chỉ không được để trống')
        .nonempty('Địa chỉ không được để trống')
        .trim(),
      gender: z
        .nativeEnum(EGender, {
          message: 'Giới tính không được để trống',
        })
        .refine((val) => val !== undefined && val !== null, {
          message: 'Giới tính không được để trống',
        }),
      dateOfBirth: z.coerce
        .date('Ngày sinh không được để trống')
        .max(new Date(), 'Ngày sinh không được ở tương lai')
        .refine(
          (d) => d <= sixteenYearsAgo,
          'Khách hàng phải từ 16 tuổi trở lên',
        ),
      customerType: z
        .nativeEnum(ECustomerType, {
          message: 'Loại khách hàng không được để trống',
        })
        .refine((val) => val !== undefined && val !== null, {
          message: 'Loại khách hàng không được để trống',
        }),
      customerCode: z
        .string('Mã khách hàng không được để trống')
        .nonempty('Mã khách hàng không được để trống')
        .trim(),
    });

    return [createSchemaFieldRule(Schema), Schema];
  }, []);

  const onFinish = (values: ICustomerCreateRequest) => {
    try {
      const parsed = Schema.parse(values);

      const payload: ICustomerCreateRequest = {
        ...parsed,
        dateOfBirth: dayjs(parsed.dateOfBirth).format('YYYY-MM-DD'),
      };

      handleSubmit?.(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
  };
};
