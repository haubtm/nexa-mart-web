import type { IPriceCreateRequest } from '@/dtos';
import { useDebounce } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useProductList } from '@/features/main/react-query';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

// Thay vì toISOString() -> dùng format có offset +07:00
const toIsoWithVNOffset = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  if (v instanceof Date)
    return dayjs(v).tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  return v; // nếu đã là string thì giữ nguyên (hoặc tự parse nếu cần)
};

export const useHook = (
  handleSubmit: (values: IPriceCreateRequest) => Promise<void>,
) => {
  const [hasEnd, setHasEnd] = useState<boolean>(true);

  const [rules, Schema] = useMemo(() => {
    const Schema = z
      .object({
        priceName: z
          .string('Tên bảng giá là bắt buộc')
          .nonempty('Tên bảng giá là bắt buộc')
          .trim(),
        priceCode: z.string('Mã bảng giá là bắt buộc').trim().optional(),
        description: z.string('Mô tả bảng giá').trim().optional(),
        startDate: z.preprocess(
          toIsoWithVNOffset,
          z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
            message: 'Ngày bắt đầu không hợp lệ',
          }),
        ),
        status: z.string().optional(),
        endDate: z.preprocess(
          (v) => (v == null || v === '' ? undefined : toIsoWithVNOffset(v)),
          z
            .string()
            .optional()
            .refine((s) => s == null || !Number.isNaN(Date.parse(s!)), {
              message: 'Ngày kết thúc không hợp lệ',
            }),
        ),
        priceDetails: z
          .array(
            z.object({
              variantId: z.number('Mã sản phẩm là bắt buộc'),
              salePrice: z
                .number('Giá bán phải là số')
                .min(0, 'Giá bán không được âm'),
            }),
          )
          .optional(),
      })
      .superRefine((val, ctx) => {
        const s = val.startDate ? dayjs(val.startDate).tz(VN_TZ) : null;
        const e = val.endDate ? dayjs(val.endDate).tz(VN_TZ) : null;
        if (s && e) {
          const min = s.startOf('day').add(1, 'day');
          if (e.isBefore(min)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['endDate'],
              message: 'Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 ngày',
            });
          }
        }
      });

    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const onFinish = async (values: IPriceCreateRequest) => {
    try {
      //hasEnd = false thì xóa endDate
      if (!hasEnd) {
        values.endDate = undefined;
      }
      const parsed = (Schema as any).parse(values);
      await handleSubmit(parsed);
    } catch (error) {
      console.error(error);
    }
  };

  const [search, setSearch] = useState<string>('');
  const searchDebounce = useDebounce(search, 500);
  const { data: productData, isLoading: isLoadingProduct } = useProductList({
    searchTerm: searchDebounce,
  });

  return {
    rules,
    onFinish,
    Schema,
    productData,
    isLoadingProduct,
    search,
    setSearch,
    hasEnd,
    setHasEnd,
  };
};
