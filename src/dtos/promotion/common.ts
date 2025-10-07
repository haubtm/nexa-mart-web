import {
  EGiftDiscountType,
  EOrderDiscountType,
  EProductDiscountType,
  EPromotionStatus,
  EPromotionType,
} from '@/lib';
import { Dayjs } from 'dayjs';

export interface IPromotionDetail {
  detailId: number;
  // Buy X Get Y
  buyProduct: {
    productUnitId: number;
    code: string;
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  buyCategory: {
    categoryId: number;
    categoryName: string;
    description: string;
  };
  buyMinQuantity: number;
  buyMinValue?: number;
  giftProduct: {
    productUnitId: number;
    code: string;
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  giftDiscountType: EGiftDiscountType;
  giftDiscountValue: number;
  giftMaxQuantity: number;
  // Order Discount
  orderDiscountType?: EOrderDiscountType;
  orderDiscountValue?: number;
  orderDiscountMaxValue?: number;
  orderMinTotalValue?: number;
  orderMinTotalQuantity?: number;
  // Product Discount
  productDiscountType?: EProductDiscountType;
  productDiscountValue?: number;
  applyToType?: string;
  applyToProduct?: {
    productUnitId: number;
    code: string;
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  applyToCategory?: {
    categoryId: number;
    categoryName: string;
    description: string;
  };
  productMinOrderValue?: number;
  productMinPromotionValue?: number;
  productMinPromotionQuantity?: number;
  promotionSummary?: string;
}

export interface IPromotionLine {
  promotionLineId: number;
  promotionCode: string;
  promotionType: EPromotionType;
  description?: string;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  status: EPromotionStatus;
  maxUsageTotal?: number;
  maxUsagePerCustomer?: number;
  currentUsageCount?: number;
  createdAt: string;
  updatedAt: string;
  usagePercentage?: number;
  activeStatus?: EPromotionStatus;
  remainingUsage?: number;
  details: IPromotionDetail[];
}

export interface IPromotionResponseData {
  promotionId: number;
  promotionName: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: EPromotionStatus;
  createdAt: string;
  updatedAt: string;
  promotionLines: IPromotionLine[];
  totalLines: number;
  activeLines: number;
  overallStatus: EPromotionStatus;
}
