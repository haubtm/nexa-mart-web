import type { ICustomerCreateRequest } from '@/dtos';
import {
  useAddressProvinceList,
  useAddressWardList,
} from '@/features/main/react-query';
import { ECustomerType, EGender } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: ICustomerCreateRequest) => void,
) => {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

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
      addressDetail: z
        .string('Địa chỉ chi tiết không được để trống')
        .nonempty('Địa chỉ chi tiết không được để trống')
        .trim(),
      provinceCode: z.union([z.string(), z.number()]).optional(),
      wardCode: z.union([z.string(), z.number()]).optional(),
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

  const onFinish = (values: any) => {
    try {
      const parsed = Schema.parse(values);

      // Find ward name and province name from form data
      const selectedWard = wardOptions.find(
        (w: any) => w.value === values.wardCode,
      );
      const selectedProvince = provinceOptions.find(
        (p: any) => p.value === values.provinceCode,
      );

      // Concatenate address: addressDetail, wardCode, wardName, provinceCode, provinceName
      const addressParts = [
        parsed.addressDetail,
        values.wardCode,
        selectedWard?.label,
        values.provinceCode,
        selectedProvince?.label,
      ].filter(Boolean);

      const fullAddress = addressParts.join(', ');

      const payload: ICustomerCreateRequest = {
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        gender: parsed.gender,
        address: fullAddress,
        dateOfBirth: dayjs(parsed.dateOfBirth).format('YYYY-MM-DD'),
        customerType: parsed.customerType,
        customerCode: parsed.customerCode,
      };

      handleSubmit?.(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const { data: provinceData } = useAddressProvinceList({
    search: '',
  });

  const { data: wardData } = useAddressWardList({
    province: selectedProvince || 1,
    search: '',
  });

  const provinceOptions = (Array.isArray(provinceData) ? provinceData : []).map(
    (province: any) => ({
      label: province.name,
      value: province.code,
    }),
  );

  const wardOptions = (Array.isArray(wardData) ? wardData : []).map((ward: any) => ({
    label: ward.name,
    value: ward.code,
  }));

  return {
    rules,
    onFinish,
    provinceOptions,
    wardOptions,
    selectedProvince,
    setSelectedProvince,
  };
};
