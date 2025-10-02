import type { IStockTakeCreateRequest } from '@/dtos';
import { createSchemaFieldRule } from 'antd-zod';
import { useMemo } from 'react';
import { z } from 'zod';

export const useHook = (
  handleSubmit: (values: IStockTakeCreateRequest) => Promise<any> | any,
  getDetails: () => IStockTakeCreateRequest['stocktakeDetails'],
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
      stocktakeCode: z
        .string()
        .nonempty('Mã kiểm kho không được để trống')
        .trim(),
      notes: z.string().trim().optional(),
      status: z.enum(['PENDING', 'COMPLETED']).optional(),
      stocktakeDetails: z
        .array(
          z.object({
            productUnitId: z.number(),
            quantityCounted: z.number(),
            reason: z.string().optional(),
          }),
        )
        .min(1, 'Vui lòng thêm ít nhất một chi tiết kiểm kho'),
    });
    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const onFinish = async (values: IStockTakeCreateRequest) => {
    try {
      const withDetails: IStockTakeCreateRequest = {
        ...values,
        stocktakeDetails: getDetails(),
      };
      const parsed = (Schema as any).parse(withDetails);
      await handleSubmit(parsed);
    } catch (error) {
      console.error(error);
    }
  };

  return { rules, onFinish };
};
