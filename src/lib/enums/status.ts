export enum StockTakeStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export enum PriceStatus {
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
  ACTIVE = 'ACTIVE',
}

export enum EPromotionStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
  UPCOMING = 'UPCOMING',
  CANCELLED = 'CANCELLED',
}

export enum EPaymentStatus {
  FAILED = 'FAILED',
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  UNPAID = 'UNPAID',
}

export enum EOrderStatus {
  UNPAID = 'UNPAID',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  PREPARED = 'PREPARED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
}
