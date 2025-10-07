import type { IPromotionDetailCreateRequest } from '@/dtos';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { useDebounce } from '@/lib';
import { createSchemaFieldRule } from 'antd-zod';
import {
  useProductList,
  useCategoryRootList,
} from '@/features/main/react-query';

export const useHook = (
  handleSubmit?: (values: IPromotionDetailCreateRequest) => Promise<void>,
) => {
  const [rules, Schema] = useMemo(() => {
    const Schema = z.object({
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
      orderDiscountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
      orderDiscountValue: z.number().nonnegative().optional(),
      orderDiscountMaxValue: z.number().nonnegative().optional(),
      orderMinTotalValue: z.number().nonnegative().optional(),
      orderMinTotalQuantity: z.number().int().nonnegative().optional(),

      // PRODUCT_DISCOUNT
      productDiscountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']).optional(),
      productDiscountValue: z.number().nonnegative().optional(),
      applyToType: z.enum(['ALL', 'PRODUCT', 'CATEGORY']).optional(),
      applyToProductId: z.number().int().nonnegative().optional(),
      applyToCategoryId: z.number().int().nonnegative().optional(),
      productMinOrderValue: z.number().nonnegative().optional(),
      productMinPromotionValue: z.number().nonnegative().optional(),
      productMinPromotionQuantity: z.number().int().nonnegative().optional(),

      // --- UI-only keys (stripped before submit)
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
    });
    return [createSchemaFieldRule(Schema), Schema] as const;
  }, []);

  const onFinish = async (rawValues: any) => {
    try {
      // UI is still nested under `detail` for convenience -> flatten to API shape
      const d = { ...(rawValues?.detail ?? {}) };

      // BUY_X_GET_Y mapping
      if (d._buyConditionType === 'PRODUCT_QTY') {
        d.buyCategoryId = undefined;
        d.buyMinValue = undefined;
      } else if (d._buyConditionType === 'CATEGORY_VALUE') {
        d.buyProductId = undefined;
        d.buyMinQuantity = undefined;
      }
      // ORDER_DISCOUNT mapping
      if (d._orderConditionType === 'NONE') {
        d.orderMinTotalValue = undefined;
        d.orderMinTotalQuantity = undefined;
      } else if (d._orderConditionType === 'MIN_ORDER_VALUE') {
        d.orderMinTotalQuantity = undefined;
      } else if (d._orderConditionType === 'MIN_DISCOUNTED_QTY') {
        d.orderMinTotalValue = undefined;
      }

      // PRODUCT_DISCOUNT mapping
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
      // strip UI-only keys
      delete d._buyConditionType;
      delete d._orderConditionType;
      delete d._productConditionType;

      const parsed = (Schema as any).parse(d);
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
    productData,
    isLoadingProduct,
    categoriesData,
    isCategoriesLoading,
    search,
    setSearch,
  };
};
