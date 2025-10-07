import type { IPromotionLineCreateRequest } from '@/dtos';
import { useMemo } from 'react';
import { z } from 'zod';
import { EPromotionType } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

// ISO UTC có 'Z'
const toIsoWithVNOffset = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  if (v instanceof Date)
    return dayjs(v).tz(VN_TZ).format('YYYY-MM-DDTHH:mm:ss');
  return v; // nếu đã là string thì giữ nguyên (hoặc tự parse nếu cần)
};

export type SubmitFn = (values: IPromotionLineCreateRequest) => Promise<void>;

export const useHook = (
  handleSubmit?: SubmitFn,
  headerStartDate?: string,
  headerEndDate?: string,
) => {
  const hdrStart = headerStartDate ? dayjs(headerStartDate) : null;
  const hdrEnd = headerEndDate ? dayjs(headerEndDate) : null;
  const [rules, Schema] = useMemo(() => {
    const Schema = z
      .object({
        promotionCode: z.string().trim(),
        promotionType: z.nativeEnum(EPromotionType),
        description: z.string().trim().optional(),
        startDate: z.preprocess(
          toIsoWithVNOffset,
          z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
            message: 'Ngày bắt đầu không hợp lệ',
          }),
        ),
        endDate: z
          .preprocess(
            toIsoWithVNOffset,
            z.string().refine((s) => !Number.isNaN(Date.parse(s!)), {
              message: 'Ngày kết thúc không hợp lệ',
            }),
          )
          .optional(),
        status: z.enum(['ACTIVE', 'EXPIRED', 'PAUSED', 'UPCOMING']).optional(),
        maxUsagePerCustomer: z.number().int().nonnegative().optional(),
        maxUsageTotal: z.number().int().nonnegative().optional(),
      })
      .superRefine((val, ctx) => {
        if (hdrStart && hdrEnd) {
          const s = dayjs(val.startDate);
          const e = dayjs(val.endDate);
          if (s.isBefore(hdrStart) || s.isAfter(hdrEnd)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['startDate'],
              message: 'Ngày bắt đầu Line phải nằm trong thời gian của Header',
            });
          }
          if (e.isBefore(hdrStart) || e.isAfter(hdrEnd)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['endDate'],
              message: 'Ngày kết thúc Line phải nằm trong thời gian của Header',
            });
          }
        }

        if (
          val.startDate &&
          val.endDate &&
          dayjs(val.endDate).isBefore(dayjs(val.startDate))
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDate'],
            message: 'Ngày kết thúc phải sau ngày bắt đầu',
          });
        }
      });

    return [createSchemaFieldRule(Schema), Schema] as const;
  }, [headerStartDate, headerEndDate]);

  const onFinish = async (rawValues: any) => {
    try {
      const values = { ...rawValues };

      // Chuẩn hoá thời gian về ISO UTC 'Z'
      values.startDate = toIsoWithVNOffset(values.startDate);
      values.endDate = toIsoWithVNOffset(values.endDate);

      const parsed = (Schema as any).parse(values);
      await handleSubmit?.(parsed);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    rules,
    onFinish,
  };
};
