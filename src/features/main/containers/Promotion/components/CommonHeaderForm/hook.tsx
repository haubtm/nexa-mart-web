import type { IPromotionHeaderCreateRequest } from '@/dtos';
import { EPromotionStatus } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo } from 'react';
import { z } from 'zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
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
  handleSubmit?: (values: IPromotionHeaderCreateRequest) => Promise<void>,
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z
      .object({
        promotionName: z
          .string('Tên chương trình là bắt buộc')
          .nonempty('Tên chương trình là bắt buộc')
          .trim(),
        description: z.string('Mô tả chương trình').trim().optional(),
        startDate: z.preprocess(
          toIsoWithVNOffset,
          z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
            message: 'Ngày bắt đầu không hợp lệ',
          }),
        ),
        status: z.enum(EPromotionStatus),
        endDate: z.preprocess(
          (v) => (v == null || v === '' ? undefined : toIsoWithVNOffset(v)),
          z.string().refine((s) => s == null || !Number.isNaN(Date.parse(s!)), {
            message: 'Ngày kết thúc không hợp lệ',
          }),
        ),
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

  const onFinish = async (values: IPromotionHeaderCreateRequest) => {
    try {
      const parsed = (Schema as any).parse(values);
      await handleSubmit!(parsed);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    rules,
    onFinish,
    Schema,
  };
};
