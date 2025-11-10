export enum EGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum ECustomerType {
  REGULAR = 'REGULAR',
  VIP = 'VIP',
}

export enum EPromotionType {
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  ORDER_DISCOUNT = 'ORDER_DISCOUNT',
  PRODUCT_DISCOUNT = 'PRODUCT_DISCOUNT',
}

export enum EGiftDiscountType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE = 'FREE',
  PERCENTAGE = 'PERCENTAGE',
}

export enum EOrderDiscountType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE = 'FREE',
  PERCENTAGE = 'PERCENTAGE',
}

export enum EProductDiscountType {
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  FREE = 'FREE',
  PERCENTAGE = 'PERCENTAGE',
}

export enum EApplyToType {
  ALL = 'ALL',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

export enum EPaymentMethod {
  CASH = 'CASH',
  ONLINE = 'ONLINE',
}

export enum EInvoiceStatus {
  CANCELLED = 'CANCELLED',
  DRAFT = 'DRAFT',
  ISSUED = 'ISSUED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  REFUNDED = 'REFUNDED',
}

export enum EDiscountType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export enum EDeliveryType {
  HOME_DELIVERY = 'HOME_DELIVERY',
  PICKUP_AT_STORE = 'PICKUP_AT_STORE',
}
