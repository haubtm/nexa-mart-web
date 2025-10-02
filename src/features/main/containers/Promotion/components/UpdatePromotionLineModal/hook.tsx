import type {
  IPromotionLineCreateRequest,
  IPromotionListResponse,
} from '@/dtos';
import {
  promotionKeys,
  usePromotionLineUpdate,
} from '@/features/main/react-query';
import { Form, type IModalRef, useNotification } from '@/lib';
import { queryClient } from '@/providers/ReactQuery';
import { type MouseEvent, useRef } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);

const VN_TZ = 'Asia/Ho_Chi_Minh';

export const useHook = (
  record?:
    | IPromotionListResponse['data']['content'][number]['promotionLines'][number]
    | null,
) => {
  const ref = useRef<IModalRef>(null);
  const [form] = Form.useForm<IPromotionLineCreateRequest>();
  const {
    mutateAsync: updatePromotionLine,
    isPending: isLoadingUpdatePromotionLine,
  } = usePromotionLineUpdate();
  const { notify } = useNotification();
  const handleCancel = (e?: MouseEvent<HTMLButtonElement>) => {
    e?.stopPropagation();
    ref?.current?.hide();
  };

  const handleSubmit = async (values: IPromotionLineCreateRequest) => {
    if (!record) {
      return;
    }

    await updatePromotionLine(
      {
        lineId: record.promotionLineId,
        promotionCode: values.promotionCode,
        promotionType: values.promotionType,
        description: values.description,
        maxUsagePerCustomer: values?.maxUsagePerCustomer,
        maxUsageTotal: values?.maxUsageTotal,
        startDate: values.startDate,
        endDate: values.endDate,
        status: values.status,
        detail: values.detail,
      },
      {
        onSuccess: () => {
          notify('success', {
            message: 'Thành công',
            description: 'Cập nhật chương trình thành công',
          });

          queryClient.invalidateQueries({
            queryKey: promotionKeys.all,
          });
        },
      },
    );

    handleCancel();
  };

  const handleOpen = () => {
    ref?.current?.open();
    const d = { ...(record?.detail || {}) } as any;

    // BUY_X_GET_Y: xác định loại điều kiện mua (product-qty vs category-value)
    if (record?.promotionType === 'BUY_X_GET_Y') {
      if (d?.buyProduct) {
        // server trả 'buyProduct' dạng object -> form dùng id
        d.buyProductId =
          d.buyProduct.productUnitId ??
          d.buyProduct.productId ??
          d.buyProductId;
        d._buyConditionType = 'PRODUCT_QTY';
        // clear nhánh kia nếu có
        d.buyCategoryId = undefined;
        d.buyMinValue = undefined;
      } else if (d?.buyCategory) {
        d.buyCategoryId = d.buyCategory.categoryId ?? d.buyCategoryId;
        d._buyConditionType = 'CATEGORY_VALUE';
        d.buyProductId = undefined;
        d.buyMinQuantity = undefined;
      }
      if (d?.giftProduct) {
        d.giftProductId =
          d.giftProduct.productUnitId ??
          d.giftProduct.productId ??
          d.giftProductId;
      }
    }

    // ORDER_DISCOUNT: auto chọn loại điều kiện tối thiểu
    if (record?.promotionType === 'ORDER_DISCOUNT') {
      if (d.orderMinTotalValue) d._orderConditionType = 'MIN_ORDER_VALUE';
      else if (d.orderMinTotalQuantity)
        d._orderConditionType = 'MIN_DISCOUNTED_QTY';
      else d._orderConditionType = 'NONE';
    }

    // PRODUCT_DISCOUNT: auto chọn applyTo + điều kiện tối thiểu
    if (record?.promotionType === 'PRODUCT_DISCOUNT') {
      // applyTo
      if (!d.applyToType) {
        d.applyToType = d.applyToProduct
          ? 'PRODUCT'
          : d.applyToCategory
            ? 'CATEGORY'
            : 'ALL';
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
      // điều kiện
      if (d.productMinOrderValue) d._productConditionType = 'MIN_ORDER_VALUE';
      else if (d.productMinPromotionValue)
        d._productConditionType = 'MIN_DISCOUNTED_VALUE';
      else if (d.productMinPromotionQuantity)
        d._productConditionType = 'MIN_DISCOUNTED_QTY';
      else d._productConditionType = 'NONE';
    }

    form.setFieldsValue({
      ...record,
      startDate: record?.startDate
        ? dayjs.tz(record.startDate, VN_TZ)
        : undefined,
      endDate: record?.endDate ? dayjs.tz(record.endDate, VN_TZ) : undefined,
      detail: d,
    });
  };

  return {
    ref,
    form,
    isLoadingUpdatePromotionLine,
    handleOpen,
    handleSubmit,
    handleCancel,
  };
};
