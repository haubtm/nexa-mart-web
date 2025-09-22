import { StockTakeStatus } from '@/lib';

export interface IStockTakeDetail {
  stocktakeDetailId: number;
  quantityExpected: number;
  quantityCounted: number;
  quantityDifference: number;
  quantityIncrease?: number | null;
  quantityDecrease?: number | null;
  reason?: string | null;
  createdAt: string;
  variant: {
    variantId: number;
    variantName: string;
    variantCode?: string | null;
    barcode?: string | null;
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
  };
  completedBy?: {
    employeeId: number;
    name: string;
    email: string;
  } | null;
  stocktakeDetails?: IStockTakeDetail[] | null;
  summary: {
    totalItems: number;
    itemsWithDifference: number;
    totalPositiveDifference: number;
    totalNegativeDifference: number;
    netDifference: number;
  };
}
