import type {
  IPromotionDetailCreateRequest,
  IPromotionListResponse,
} from '@/dtos';
import {
  promotionKeys,
  usePromotionDetailUpdate,
} from '@/features/main/react-query';
import { EPromotionType, Form, type IModalRef, useNotification } from '@/lib';
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

        // ===== Detail request mới (phẳng, không category) =====
        promotionCode: values.promotionCode,
        usageLimit: values.usageLimit,
        usageCount: values.usageCount,

        // BUY_X_GET_Y (chỉ theo PRODUCT)
        buyProductId: values.buyProductId,
        buyMinQuantity: values.buyMinQuantity,
        buyMinValue: values.buyMinValue,

        giftProductId: values.giftProductId,
        giftQuantity: values.giftQuantity, // ✅ KHÔNG lấy từ giftMaxQuantity nữa
        giftDiscountType: values.giftDiscountType,
        giftDiscountValue:
          values.giftDiscountType === 'FREE'
            ? undefined
            : values.giftDiscountValue,
        giftMaxQuantity: values.giftMaxQuantity,

        // ORDER_DISCOUNT
        orderDiscountType: values.orderDiscountType,
        orderDiscountValue: values.orderDiscountValue,
        orderDiscountMaxValue: values.orderDiscountMaxValue,
        orderMinTotalValue: values.orderMinTotalValue,
        orderMinTotalQuantity: values.orderMinTotalQuantity,

        // PRODUCT_DISCOUNT (không CATEGORY)
        productDiscountType: values.productDiscountType,
        productDiscountValue: values.productDiscountValue,
        applyToType: values.applyToType, // 'ALL' | 'PRODUCT'
        applyToProductId: values.applyToProductId,

        productMinOrderValue: values.productMinOrderValue,
        productMinPromotionValue: values.productMinPromotionValue,
        productMinPromotionQuantity: values.productMinPromotionQuantity,
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

    const d: any = { ...(record || {}) };

    // ===== Chuẩn hóa lại các id theo PRODUCT (loại bỏ category) =====
    if (promotionType === EPromotionType.BUY_X_GET_Y) {
      if (d.buyProduct) {
        d.buyProductId =
          d.buyProduct.productUnitId ??
          d.buyProduct.productId ??
          d.buyProductId;
      }
      if (d.giftProduct) {
        d.giftProductId =
          d.giftProduct.productUnitId ??
          d.giftProduct.productId ??
          d.giftProductId;
      }
      // ❌ Không dùng buyCategory*
      d.buyCategory = undefined;
      d.buyCategoryId = undefined;
    }

    if (promotionType === EPromotionType.PRODUCT_DISCOUNT) {
      // applyTo: chỉ ALL | PRODUCT
      if (!d.applyToType) {
        d.applyToType = d.applyToProduct ? 'PRODUCT' : 'ALL';
      }
      if (d.applyToProduct) {
        d.applyToProductId =
          d.applyToProduct.productUnitId ??
          d.applyToProduct.productId ??
          d.applyToProductId;
      }
      // ❌ Không dùng applyToCategory*
      d.applyToCategory = undefined;
      d.applyToCategoryId = undefined;

      // Giữ lại các trường điều kiện tối thiểu hiện có (nếu form cần)
      // d._productConditionType được tạo ở CommonDetailForm (không set ở đây).
    }

    // Tránh điền nhầm giftQuantity
    if (d.giftMaxQuantity && !d.giftQuantity) d.giftQuantity = undefined;

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
