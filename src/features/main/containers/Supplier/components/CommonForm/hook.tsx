import type { ISupplierCreateRequest } from '@/dtos';
import {
  useAddressProvinceList,
  useAddressWardList,
} from '@/features/main/react-query';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo, useState } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: ISupplierCreateRequest) => void,
) => {
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

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
      addressDetail: z
        .string('Địa chỉ chi tiết không được để trống')
        .nonempty('Địa chỉ chi tiết không được để trống')
        .trim(),
      provinceCode: z.union([z.string(), z.number()]).optional(),
      wardCode: z.union([z.string(), z.number()]).optional(),
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

  const onFinish = (values: any) => {
    try {
      const parsed = Schema.parse(values);

      // Find ward name and province name from form data
      const selectedWard = wardOptions.find(
        (w: any) => w.value === values.wardCode,
      );
      const selectedProv = provinceOptions.find(
        (p: any) => p.value === values.provinceCode,
      );

      // Concatenate address: addressDetail, wardCode, wardName, provinceCode, provinceName
      const addressParts = [
        parsed.addressDetail,
        values.wardCode,
        selectedWard?.label,
        values.provinceCode,
        selectedProv?.label,
      ].filter(Boolean);

      const fullAddress = addressParts.join(', ');

      const payload: ISupplierCreateRequest = {
        code: parsed.code,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone,
        address: fullAddress,
        isActive: parsed.isActive,
      };

      handleSubmit?.(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
    provinceOptions,
    wardOptions,
    selectedProvince,
    setSelectedProvince,
  };
};
