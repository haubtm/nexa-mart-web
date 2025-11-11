import { EOrderStatus, EPaymentStatus } from '../enums';

export const paymentStatusMap: Record<string, string> = {
  [EPaymentStatus.PAID]: 'Đã thanh toán',
  [EPaymentStatus.UNPAID]: 'Chưa thanh toán',
  [EPaymentStatus.FAILED]: 'Thanh toán thất bại',
  [EPaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

export const orderStatusMap: Record<string, string> = {
  [EOrderStatus.UNPAID]: 'Chưa thanh toán',
  [EOrderStatus.PENDING]: 'Chờ xử lý',
  [EOrderStatus.COMPLETED]: 'Đã hoàn thành',
  [EOrderStatus.CANCELLED]: 'Đã hủy',
  [EOrderStatus.DELIVERED]: 'Đã giao hàng',
  [EOrderStatus.SHIPPING]: 'Đang giao hàng',
  [EOrderStatus.PREPARED]: 'Đã chuẩn bị',
};
