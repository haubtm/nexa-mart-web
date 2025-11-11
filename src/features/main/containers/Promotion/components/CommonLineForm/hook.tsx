import type { IPromotionLineCreateRequest } from '@/dtos';
import { useMemo } from 'react';
import { z } from 'zod';
import { EPromotionType } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import dayjs from 'dayjs';

const toDateStr = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.format('YYYY-MM-DD');
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD');
  return v;
};

export type SubmitFn = (values: IPromotionLineCreateRequest) => Promise<void>;

export const useHook = (
  handleSubmit?: SubmitFn,
  headerStartDate?: string,
  headerEndDate?: string,
) => {
  const hdrStart = headerStartDate
    ? dayjs(headerStartDate, 'YYYY-MM-DD')
    : null;
  const hdrEnd = headerEndDate ? dayjs(headerEndDate, 'YYYY-MM-DD') : null;

  const [rules, Schema] = useMemo(() => {
    const Schema = z
      .object({
        lineName: z
          .string('Nhập tên khuyến mãi')
          .trim()
          .nonempty('Nhập tên khuyến mãi'),
        promotionType: z.nativeEnum(EPromotionType),
        description: z.string().trim().optional(),
        startDate: z.preprocess(
          toDateStr,
          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày bắt đầu không hợp lệ'),
        ),
        endDate: z.preprocess(
          toDateStr,
          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày kết thúc không hợp lệ'),
        ),
        status: z.enum(['ACTIVE', 'EXPIRED', 'PAUSED', 'UPCOMING']).optional(),
      })
      .superRefine((val, ctx) => {
        const s = dayjs(val.startDate, 'YYYY-MM-DD');
        const e = dayjs(val.endDate, 'YYYY-MM-DD');

        if (e.isBefore(s)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDate'],
            message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
          });
        }
        if (hdrStart && hdrEnd) {
          if (s.isBefore(hdrStart) || s.isAfter(hdrEnd)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['startDate'],
              message: 'StartDate của Line phải nằm trong Header',
            });
          }
          if (e.isBefore(hdrStart) || e.isAfter(hdrEnd)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['endDate'],
              message: 'EndDate của Line phải nằm trong Header',
            });
          }
        }
      });
    return [createSchemaFieldRule(Schema), Schema] as const;
  }, [headerStartDate, headerEndDate]);

  const onFinish = async (values: any) => {
    try {
      values.startDate = toDateStr(values.startDate);
      values.endDate = toDateStr(values.endDate);
      const parsed = (Schema as any).parse(values);
      await handleSubmit?.(parsed);
    } catch (err) {
      console.error(err);
    }
  };
  return { rules, onFinish };
};
