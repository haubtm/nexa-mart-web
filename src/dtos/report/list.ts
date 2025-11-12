import { IResponse } from '../common';

export interface IReportSaleDailyRequest {
  fromDate: string;
  toDate: string;
  employeeId?: number;
}

interface IReportSaleDailyResponseData {
  fromDate: string;
  toDate: string;
  employeeSalesList: {
    stt: number;
    employeeCode: string;
    employeeName: string;
    dailySales: {
      employeeCode: string;
      employeeName: string;
      saleDate: string;
      totalDiscount: number;
      revenueBeforeDiscount: number;
      revenueAfterDiscount: number;
    }[];
    totalDiscount: number;
    totalRevenueBeforeDiscount: number;
    totalRevenueAfterDiscount: number;
  }[];
  grandTotalDiscount: number;
  grandTotalRevenueBeforeDiscount: number;
  grandTotalRevenueAfterDiscount: number;
}

export interface IReportSaleDailyResponse
  extends IResponse<IReportSaleDailyResponseData> {}

export interface IReportReturnRequest {
  fromDate: string;
  toDate: string;
}

export interface IReportReturnResponseData {
  fromDate: string;
  toDate: string;
  returnItems: {
    originalInvoiceNumber: string;
    originalInvoiceDate: string;
    returnCode: string;
    returnDate: string;
    products: {
      categoryName: string;
      productCode: string;
      productName: string;
      unitName: string;
      quantity: number;
      priceAtReturn: number;
      refundAmount: number;
    }[];
    totalQuantity: number;
    totalRefundAmount: number;
  }[];
  totalQuantity: number;
  totalRefundAmount: number;
}

export interface IReportReturnResponse
  extends IResponse<IReportReturnResponseData> {}

export interface IReportPromotionRequest {
  fromDate: string;
  toDate: string;
  promotionCode?: string;
}

export interface IReportPromotionResponseData {
  promotionList: {
    promotionCode: string;
    promotionName: string;
    startDate: string;
    endDate: string;
    promotionType: 'BUY_X_GET_Y' | 'ORDER_DISCOUNT' | 'PRODUCT_DISCOUNT';
    giftProductCode: string | null;
    giftProductName: string | null;
    giftQuantity: number | null;
    giftUnit: string | null;
    discountAmount: number | null;
    usageLimit: number | null;
    usageCount: number;
    remainingCount: number | null;
  }[];
  totalGiftQuantity: number;
  totalDiscountAmount: number;
  totalBudget: number;
  totalUsed: number;
  totalRemaining: number;
}

export interface IReportPromotionResponse
  extends IResponse<IReportPromotionResponseData> {}

export interface IReportCustomerSaleRequest {
  fromDate: string;
  toDate: string;
  customerId?: number;
}

interface IReportCustomerSaleResponseData {
  fromDate: string;
  toDate: string;
  customerSalesList: {
    customerId: number;
    customerCode: string;
    customerName: string;
    address: string;
    customerType: string;
    categorySalesList: {
      categoryName: string;
      revenueBeforeDiscount: number;
      discount: number;
      revenueAfterDiscount: number;
    }[];
    totalDiscount: number;
    totalRevenueBeforeDiscount: number;
    totalRevenueAfterDiscount: number;
  }[];
  grandTotalDiscount: number;
  grandTotalRevenueBeforeDiscount: number;
  grandTotalRevenueAfterDiscount: number;
}

export interface IReportCustomerSaleResponse
  extends IResponse<IReportCustomerSaleResponseData> {}
