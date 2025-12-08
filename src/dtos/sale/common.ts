import { EGiftDiscountType, EInvoiceStatus, EPaymentMethod } from '@/lib';

interface IAppliedPromotions {
  promotionId: string;
  promotionName: string;
  promotionDetailId: number;
  promotionSummary: string;
  discountType: EGiftDiscountType;
  discountValue: number;
  sourceLineItemId: number;
}

interface IItemPromotion {
  invoiceDetailId: number;
  productUnitId: number;
  productName: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  lineTotal: number;
}

export interface ISaleResponseData {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  subtotal: number;
  totalDiscount: number;
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  customerName: string;
  employeeName: string;
  items: (IItemPromotion & { promotionApplied: IAppliedPromotions })[];
  orderCode: number;
  paymentUrl: string;
  qrCode: string;
  status: EInvoiceStatus;
}

export interface IOrderResponseData {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  orderId: number;
  customerName: string;
  employeeName: string;
  paymentMethod: EPaymentMethod;
  status: EInvoiceStatus;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  paidAmount: number;
  items: (IItemPromotion & { appliedPromotions: IAppliedPromotions })[];
  appliedOrderPromotions: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: EGiftDiscountType;
    discountValue: number;
  }[];
  createdAt: string;
}
