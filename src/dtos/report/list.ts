import { IResponse } from '../common';

export interface IReportListRequest {
  fromDate: string;
  toDate: string;
  employeeId?: number;
}

export interface IReportListResponseData {
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

export interface IReportListResponse
  extends IResponse<IReportListResponseData> {}
