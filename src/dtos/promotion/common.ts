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
  promotionCode: string;
  usageLimit: number;
  usageCount: number;
  // Buy X Get Y
  buyProduct: {
    productUnitId: number;
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  buyMinQuantity: number;
  buyMinValue?: number;
  giftProduct: {
    productUnitId: number;
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  giftQuantity?: number;
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
    barcode: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
  productMinOrderValue?: number;
  productMinPromotionValue?: number;
  productMinPromotionQuantity?: number;
  promotionSummary?: string;
}

export interface IPromotionLine {
  promotionLineId: number;
  lineName: string;
  promotionType: EPromotionType;
  description?: string;
  startDate: string | Dayjs;
  endDate: string | Dayjs;
  status: EPromotionStatus;
  createdAt: string;
  updatedAt: string;
  details: IPromotionDetail[];
  activeStatus?: EPromotionStatus;
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
