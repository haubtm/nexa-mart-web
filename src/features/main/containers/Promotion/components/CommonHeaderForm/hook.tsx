import type { IPromotionHeaderCreateRequest } from '@/dtos';
import { EPromotionStatus } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo } from 'react';
import { z } from 'zod';
import dayjs from 'dayjs';

const toDateStr = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.format('YYYY-MM-DD');
  if (v instanceof Date) return dayjs(v).format('YYYY-MM-DD');
  return v;
};

export const useHook = (
  handleSubmit?: (values: IPromotionHeaderCreateRequest) => Promise<void>,
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z
      .object({
        promotionName: z.string().nonempty().trim(),
        description: z.string().trim().optional(),
        startDate: z.preprocess(
          toDateStr,
          z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày bắt đầu không hợp lệ'),
        ),
        status: z.enum(EPromotionStatus),
        endDate: z.preprocess(
          (v) => (v == null || v === '' ? undefined : toDateStr(v)),
          z
            .string()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày kết thúc không hợp lệ')
            .optional(),
        ),
      })
      .superRefine((val, ctx) => {
        const s = val.startDate ? dayjs(val.startDate, 'YYYY-MM-DD') : null;
        const e = val.endDate ? dayjs(val.endDate, 'YYYY-MM-DD') : null;
        if (s && e && e.isBefore(s)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDate'],
            message: 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu',
          });
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
