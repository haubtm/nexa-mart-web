import {
  EDeliveryType,
  EDiscountType,
  EOrderStatus,
  EPaymentMethod,
  EPaymentStatus,
} from '@/lib';

export interface IOrderResponseData {
  orderId: number;
  orderCode: string;
  orderStatus: EOrderStatus;
  deliveryType: EDeliveryType;
  paymentMethod: EPaymentMethod;
  transactionId: number | null;
  customerInfo: {
    customerId: number;
    customerName: string;
    phoneNumber: string;
    email: string;
    currentLoyaltyPoints: number;
  };
  deliveryInfo: {
    recipientName: string | null;
    deliveryPhone: string | null;
    deliveryAddress: string;
    deliveryNote: string | null;
  };
  orderItems: {
    productUnitId: number;
    productName: string;
    unitName: string;
    barcode: string;
    quantity: number;
    originalPrice: number;
    discountedPrice: number;
    discountAmount: number;
    lineTotal: number;
    promotionInfo: string | null;
  }[];
  subtotal: number;
  totalDiscount: number;
  shippingFee: number;
  loyaltyPointsUsed: number;
  loyaltyPointsDiscount: number;
  totalAmount: number;
  amountPaid: number;
  changeAmount: number;
  onlinePaymentInfo: {
    transactionId: number | null;
    paymentProvider: string | null;
    paymentStatus: EPaymentStatus;
    paymentUrl: string | null;
    qrCode: string | null;
    expirationTime: string | null;
  };
  appliedPromotions: {
    promotionId: string;
    promotionName: string;
    promotionDetailId: number;
    promotionSummary: string;
    discountType: EDiscountType;
    discountValue: number;
    sourceLineItemId: number | null;
  }[];
  loyaltyPointsEarned: number;
  createdAt: string;
  message: string;
}
