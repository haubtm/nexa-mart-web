export interface IRefundDetail {
  returnDetailId: number;
  quantity: number;
  productName: string;
  productUnit: string;
  priceReturn: number;
  returnAmount: number;
}

export interface IRefundResponseData {
  returnId: number;
  returnCode: string;
  returnDate: string;
  invoiceNumber: string;
  invoiceId: number;
  customer: string;
  employee: {
    employeeId: number;
    name: string;
    email: string;
  };
  totalRefundAmount: number;
  reclaimedDiscountAmount: number;
  finalRefundAmount: number;
  reasonNote: string;
  returnDetails: IRefundDetail[];
  createdAt: string;
  updatedAt: string;
}
