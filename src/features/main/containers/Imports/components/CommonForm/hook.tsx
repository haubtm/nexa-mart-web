import type { IImportsCreateRequest } from '@/dtos';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useDebounce } from '@/lib';
import { useProductList, useSupplierList } from '@/features/main/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

const toIsoWithVNOffset = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  if (v instanceof Date)
    return dayjs(v).tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  return v;
};

export const useHook = (
  handleSubmit: (values: IImportsCreateRequest) => Promise<any> | any,
  getDetails: () => IImportsCreateRequest['importDetails'],
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      importCode: z.string().trim().optional(),
      supplierId: z
        .number('Vui lòng chọn nhà cung cấp')
        .min(1, 'Vui lòng chọn nhà cung cấp'),
      importDate: z.preprocess(
        toIsoWithVNOffset,
        z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
          message: 'Ngày nhập không hợp lệ',
        }),
      ),
      notes: z.string().trim().optional(),
      status: z.enum(['PENDING', 'COMPLETED']).optional(),
      importDetails: z
        .array(
          z.object({
            productUnitId: z.number(),
            quantity: z.number(),
            notes: z.string().optional(),
          }),
        )
        .min(1, 'Vui lòng thêm ít nhất một chi tiết nhập kho'),
    });
    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const { data: supplierOptions, isLoading: isLoadingSuppliers } =
    useSupplierList({});

  // search sản phẩm
  const [search, setSearch] = useState<string>('');
  const searchDebounce = useDebounce(search, 500);
  const { data: productVariants, isLoading: isLoadingVariants } =
    useProductList({ searchTerm: searchDebounce });

  const onFinish = async (values: IImportsCreateRequest) => {
    try {
      // GHÉP chi tiết nhập từ bảng trước khi validate
      const withDetails: IImportsCreateRequest = {
        ...values,
        importDetails: getDetails(),
      };
      const parsed = (Schema as any).parse(withDetails);
      await handleSubmit(parsed);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
    productVariants,
    isLoadingVariants,
    supplierOptions,
    isLoadingSuppliers,
    search,
    setSearch,
    Schema,
  };
};
