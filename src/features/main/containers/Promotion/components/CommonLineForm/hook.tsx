// hook.tsx
import type { IPromotionLineCreateRequest } from '@/dtos';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { EPromotionType, useDebounce } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import {
  useProductList,
  useCategoryRootList,
} from '@/features/main/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

// ISO UTC có 'Z'
const toIsoUTCZ = (v: unknown) => {
  if (dayjs.isDayjs(v)) return v.utc().toISOString();
  if (v instanceof Date) return dayjs(v).utc().toISOString();
  if (typeof v === 'string') return dayjs(v).utc().toISOString();
  return v as any;
};

export type SubmitFn = (values: IPromotionLineCreateRequest) => Promise<void>;

export const useHook = (handleSubmit?: SubmitFn) => {
  const [hasEnd, setHasEnd] = useState(true);

  const [rules, Schema] = useMemo(() => {
    const Detail = z
      .object({
        // BUY_X_GET_Y
        buyProductId: z.number().int().nonnegative().optional(),
        buyCategoryId: z.number().int().nonnegative().optional(),
        buyMinQuantity: z.number().int().positive().optional(),
        buyMinValue: z.number().nonnegative().optional(),

        giftProductId: z.number().int().nonnegative().optional(),
        giftDiscountType: z
          .enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE'])
          .optional(),
        giftDiscountValue: z.number().nonnegative().optional(),
        giftMaxQuantity: z.number().int().positive().optional(),

        // ORDER_DISCOUNT
        orderDiscountType: z
          .enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE'])
          .optional(),
        orderDiscountValue: z.number().nonnegative().optional(),
        orderDiscountMaxValue: z.number().nonnegative().optional(),
        orderMinTotalValue: z.number().nonnegative().optional(),
        orderMinTotalQuantity: z.number().int().nonnegative().optional(),

        // PRODUCT_DISCOUNT
        productDiscountType: z
          .enum(['PERCENTAGE', 'FIXED_AMOUNT', 'FREE'])
          .optional(),
        productDiscountValue: z.number().nonnegative().optional(),
        applyToType: z.enum(['ALL', 'PRODUCT', 'CATEGORY']).optional(),
        applyToProductId: z.number().int().nonnegative().optional(),
        applyToCategoryId: z.number().int().nonnegative().optional(),
        productMinOrderValue: z.number().nonnegative().optional(),
        productMinPromotionValue: z.number().nonnegative().optional(),
        productMinPromotionQuantity: z.number().int().nonnegative().optional(),

        // --- khóa nội bộ UI (remove trước khi submit) ---
        _buyConditionType: z.enum(['PRODUCT_QTY', 'CATEGORY_VALUE']).optional(),
        _orderConditionType: z
          .enum(['NONE', 'MIN_ORDER_VALUE', 'MIN_DISCOUNTED_QTY'])
          .optional(),
        _productConditionType: z
          .enum([
            'NONE',
            'MIN_ORDER_VALUE',
            'MIN_DISCOUNTED_VALUE',
            'MIN_DISCOUNTED_QTY',
          ])
          .optional(),
      })
      .strict();

    const Schema = z
      .object({
        promotionCode: z.string().trim().optional(),
        promotionType: z.nativeEnum(EPromotionType),
        description: z.string().trim().optional(),
        startDate: z.preprocess(
          toIsoUTCZ,
          z
            .string()
            .refine((s) => !Number.isNaN(Date.parse(s)), {
              message: 'Ngày bắt đầu không hợp lệ',
            }),
        ),
        endDate: z
          .preprocess(
            (v) => (v == null || v === '' ? undefined : toIsoUTCZ(v)),
            z
              .string()
              .optional()
              .refine((s) => s == null || !Number.isNaN(Date.parse(s!)), {
                message: 'Ngày kết thúc không hợp lệ',
              }),
          )
          .optional(),
        status: z.enum(['ACTIVE', 'EXPIRED', 'PAUSED', 'UPCOMING']).optional(),
        maxUsagePerCustomer: z.number().int().nonnegative().optional(),
        maxUsageTotal: z.number().int().nonnegative().optional(),
        detail: Detail,
      })
      .superRefine((val, ctx) => {
        const d = val.detail || {};

        if (val.promotionType === EPromotionType.BUY_X_GET_Y) {
          const condA = d.buyProductId != null && d.buyMinQuantity != null;
          const condB = d.buyCategoryId != null && d.buyMinValue != null;
          if (!condA && !condB) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                'Chọn 1 trong 2 điều kiện mua (sản phẩm+số lượng) hoặc (danh mục+giá trị)',
              path: ['detail'],
            });
          }
          if (d.giftProductId == null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn sản phẩm tặng',
              path: ['detail', 'giftProductId'],
            });
          }
          if (
            d.giftDiscountType &&
            d.giftDiscountType !== 'FREE' &&
            !d.giftDiscountValue
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Nhập giftDiscountValue khi giftDiscountType ≠ FREE',
              path: ['detail', 'giftDiscountValue'],
            });
          }
        }

        if (val.promotionType === EPromotionType.ORDER_DISCOUNT) {
          if (!d.orderDiscountType) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn hình thức giảm giá đơn hàng',
              path: ['detail', 'orderDiscountType'],
            });
          } else if (
            d.orderDiscountType !== 'FREE' &&
            (d.orderDiscountValue == null || d.orderDiscountValue <= 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Nhập orderDiscountValue > 0',
              path: ['detail', 'orderDiscountValue'],
            });
          }
        }

        if (val.promotionType === EPromotionType.PRODUCT_DISCOUNT) {
          if (!d.productDiscountType) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn hình thức giảm giá sản phẩm',
              path: ['detail', 'productDiscountType'],
            });
          } else if (
            d.productDiscountType !== 'FREE' &&
            (d.productDiscountValue == null || d.productDiscountValue <= 0)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Nhập productDiscountValue > 0',
              path: ['detail', 'productDiscountValue'],
            });
          }
          if (!d.applyToType) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn đối tượng áp dụng',
              path: ['detail', 'applyToType'],
            });
          } else if (
            d.applyToType === 'PRODUCT' &&
            d.applyToProductId == null
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn sản phẩm áp dụng',
              path: ['detail', 'applyToProductId'],
            });
          } else if (
            d.applyToType === 'CATEGORY' &&
            d.applyToCategoryId == null
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Chọn danh mục áp dụng',
              path: ['detail', 'applyToCategoryId'],
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
  }, []);

  const onFinish = async (rawValues: any) => {
    try {
      const values = { ...rawValues };

      // không có ngày kết thúc -> remove
      if (!hasEnd) values.endDate = undefined;

      // Chuẩn hoá thời gian về ISO UTC 'Z'
      values.startDate = toIsoUTCZ(values.startDate);
      if (values.endDate) values.endDate = toIsoUTCZ(values.endDate);

      // Mapping điều kiện theo radio nội bộ trong detail
      if (values.detail) {
        const d = { ...values.detail };

        // BUY_X_GET_Y
        if (values.promotionType === EPromotionType.BUY_X_GET_Y) {
          if (d._buyConditionType === 'PRODUCT_QTY') {
            d.buyCategoryId = undefined;
            d.buyMinValue = undefined;
          } else if (d._buyConditionType === 'CATEGORY_VALUE') {
            d.buyProductId = undefined;
            d.buyMinQuantity = undefined;
          }
        }

        // ORDER_DISCOUNT
        if (values.promotionType === EPromotionType.ORDER_DISCOUNT) {
          if (d._orderConditionType === 'NONE') {
            d.orderMinTotalValue = undefined;
            d.orderMinTotalQuantity = undefined;
          } else if (d._orderConditionType === 'MIN_ORDER_VALUE') {
            d.orderMinTotalQuantity = undefined;
          } else if (d._orderConditionType === 'MIN_DISCOUNTED_QTY') {
            d.orderMinTotalValue = undefined;
          }
        }

        // PRODUCT_DISCOUNT
        if (values.promotionType === EPromotionType.PRODUCT_DISCOUNT) {
          if (d._productConditionType === 'NONE') {
            d.productMinOrderValue = undefined;
            d.productMinPromotionValue = undefined;
            d.productMinPromotionQuantity = undefined;
          } else if (d._productConditionType === 'MIN_ORDER_VALUE') {
            d.productMinPromotionValue = undefined;
            d.productMinPromotionQuantity = undefined;
          } else if (d._productConditionType === 'MIN_DISCOUNTED_VALUE') {
            d.productMinOrderValue = undefined;
            d.productMinPromotionQuantity = undefined;
          } else if (d._productConditionType === 'MIN_DISCOUNTED_QTY') {
            d.productMinOrderValue = undefined;
            d.productMinPromotionValue = undefined;
          }
        }

        // Xoá khóa nội bộ
        delete d._buyConditionType;
        delete d._orderConditionType;
        delete d._productConditionType;

        values.detail = d;
      }

      const parsed = (Schema as any).parse(values);
      await handleSubmit?.(parsed);
    } catch (err) {
      console.error(err);
    }
  };

  // Search SP & Category
  const [search, setSearch] = useState('');
  const searchDebounce = useDebounce(search, 400);
  const { data: productData, isLoading: isLoadingProduct } = useProductList({
    searchTerm: searchDebounce,
  });
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategoryRootList();

  return {
    rules,
    onFinish,
    hasEnd,
    setHasEnd,
    productData,
    isLoadingProduct,
    categoriesData,
    isCategoriesLoading,
    search,
    setSearch,
  };
};
