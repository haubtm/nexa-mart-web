import { EOrderStatus, EPaymentStatus } from '../enums';

export const paymentStatusMap: Record<string, string> = {
  [EPaymentStatus.PAID]: 'Đã thanh toán',
  [EPaymentStatus.UNPAID]: 'Chưa thanh toán',
  [EPaymentStatus.FAILED]: 'Thanh toán thất bại',
  [EPaymentStatus.REFUNDED]: 'Đã hoàn tiền',
};

export const orderStatusMap: Record<string, string> = {
  [EOrderStatus.PENDING]: 'Đang chờ',
  [EOrderStatus.COMPLETED]: 'Đã hoàn thành',
  [EOrderStatus.CANCELLED]: 'Đã hủy',
  [EOrderStatus.DELIVERED]: 'Đã giao',
  [EOrderStatus.SHIPPING]: 'Đang vận chuyển',
  [EOrderStatus.PREPARING]: 'Đang chuẩn bị',
};
