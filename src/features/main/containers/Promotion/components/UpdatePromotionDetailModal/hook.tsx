import type {
  IPromotionDetailCreateRequest,
  IPromotionListResponse,
} from '@/dtos';
import {
  promotionKeys,
  usePromotionDetailUpdate,
} from '@/features/main/react-query';
import {
  EApplyToType,
  EPromotionType,
  Form,
  type IModalRef,
  useNotification,
} from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';

export const useHook = (
  record?:
    | IPromotionListResponse['data']['content'][number]['promotionLines'][number]['details'][number]
    | null,
  promotionType?: EPromotionType,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionDetailCreateRequest>();
  const {
    mutateAsync: updatePromotionDetail,
    isPending: isLoadingUpdatePromotionDetail,
  } = usePromotionDetailUpdate();
  const { notify } = useNotification();

  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionDetailCreateRequest) => {
    if (!record) return;

    await updatePromotionDetail(
      {
        detailId: record.detailId,
        // payload phẳng đúng API
        applyToCategoryId: values.applyToCategoryId,
        applyToProductId: values.applyToProductId,
        applyToType: values.applyToType,
        productMinOrderValue: values.productMinOrderValue,
        productMinPromotionValue: values.productMinPromotionValue,
        productMinPromotionQuantity: values.productMinPromotionQuantity,
        orderMinTotalValue: values.orderMinTotalValue,
        orderMinTotalQuantity: values.orderMinTotalQuantity,
        buyProductId: values.buyProductId,
        buyMinQuantity: values.buyMinQuantity,
        buyMinValue: values.buyMinValue,
        giftProductId: values.giftProductId,
        buyCategoryId: values.buyCategoryId,
        giftDiscountType: values.giftDiscountType,
        giftDiscountValue:
          values.giftDiscountType === 'FREE'
            ? undefined
            : values.giftDiscountValue,
        giftMaxQuantity: values.giftMaxQuantity,
        giftQuantity: values.giftMaxQuantity || undefined,
        orderDiscountMaxValue: values.orderDiscountMaxValue,
        orderDiscountType: values.orderDiscountType,
        orderDiscountValue: values.orderDiscountValue,
        productDiscountType: values.productDiscountType,
        productDiscountValue: values.productDiscountValue,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật chi tiết chương trình thành công',
          });
          queryClient.invalidateQueries({ queryKey: promotionKeys.all });
          handleCancel();
        },
        onError: (error: any) => {
          notify('error', { message: 'Thất bại', description: error.message });
        },
      },
    );
  };

  const handleOpen = () => {
    ref?.current?.open();
    // record chính là detail
    const d: any = { ...(record || {}) };

    // BUY_X_GET_Y → xác định điều kiện mua & map id
    if (promotionType === EPromotionType.BUY_X_GET_Y) {
      if (d.buyProduct) {
        d.buyProductId =
          d.buyProduct.productUnitId ??
          d.buyProduct.productId ??
          d.buyProductId;
        d._buyConditionType = 'PRODUCT_QTY';
        d.buyCategoryId = undefined;
        d.buyMinValue = undefined;
      } else if (d.buyCategory) {
        d.buyCategoryId = d.buyCategory.categoryId ?? d.buyCategoryId;
        d._buyConditionType = 'CATEGORY_VALUE';
        d.buyProductId = undefined;
        d.buyMinQuantity = undefined;
      }
      if (d.giftProduct) {
        d.giftProductId =
          d.giftProduct.productUnitId ??
          d.giftProduct.productId ??
          d.giftProductId;
      }
    }

    // ORDER_DISCOUNT → điều kiện tối thiểu
    if (promotionType === EPromotionType.ORDER_DISCOUNT) {
      if (d.orderMinTotalValue) d._orderConditionType = 'MIN_ORDER_VALUE';
      else if (d.orderMinTotalQuantity)
        d._orderConditionType = 'MIN_DISCOUNTED_QTY';
      else d._orderConditionType = 'NONE';
    }

    // PRODUCT_DISCOUNT → applyTo + điều kiện tối thiểu
    if (promotionType === EPromotionType.PRODUCT_DISCOUNT) {
      if (!d.applyToType) {
        d.applyToType = d.applyToProduct
          ? EApplyToType.PRODUCT
          : d.applyToCategory
            ? EApplyToType.CATEGORY
            : EApplyToType.ALL;
      }
      if (d.applyToProduct) {
        d.applyToProductId =
          d.applyToProduct.productUnitId ??
          d.applyToProduct.productId ??
          d.applyToProductId;
      }
      if (d.applyToCategory) {
        d.applyToCategoryId =
          d.applyToCategory.categoryId ?? d.applyToCategoryId;
      }
      if (d.productMinOrderValue) d._productConditionType = 'MIN_ORDER_VALUE';
      else if (d.productMinPromotionValue)
        d._productConditionType = 'MIN_DISCOUNTED_VALUE';
      else if (d.productMinPromotionQuantity)
        d._productConditionType = 'MIN_DISCOUNTED_QTY';
      else d._productConditionType = 'NONE';
    }

    form.setFieldsValue({ detail: d });
  };

  return {
    ref,
    form,
    isLoadingUpdatePromotionDetail,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
