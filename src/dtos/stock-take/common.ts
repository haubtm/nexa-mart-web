import { ERole, StockTakeStatus } from '@/lib';

export interface IStockTakeDetail {
  stocktakeDetailId: number;
  quantityExpected: number;
  quantityCounted: number;
  quantityDifference: number;
  quantityIncrease?: number | null;
  quantityDecrease?: number | null;
  reason?: string | null;
  createdAt: string;
  productUnit: {
    productUnitId: number;
    code?: string;
    barcode?: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
}

export interface IStockTakeResponseData {
  stocktakeId: number;
  stocktakeCode: string;
  status: StockTakeStatus;
  notes?: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    employeeId: number;
    name: string;
    email: string;
    role: ERole;
  };
  completedBy?: {
    employeeId: number;
    name: string;
    email: string;
    role: ERole;
  };
  stocktakeDetails?: IStockTakeDetail[];
  summary: {
    totalItems: number;
    itemsWithDifference: number;
    totalPositiveDifference: number;
    totalNegativeDifference: number;
    netDifference: number;
  };
}
