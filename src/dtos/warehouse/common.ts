import { ETransaction } from '@/lib';

interface IProductUnit {
  productUnitId: number;
  code?: string | null;
  barcode?: string | null;
  conversionValue: number;
  isBaseUnit: boolean;
  productName: string;
  unit: string;
}

export interface IWarehouseResponseData {
  warehouseId: number;
  quantityOnHand: number;
  updatedAt: string;
  productUnit: IProductUnit;
}

export interface IWarehouseTransactionResponseData {
  transactionId: number;
  beforeQuantity: number;
  quantityChange: number;
  newQuantity: number;
  transactionType: ETransaction;
  referenceId?: number;
  notes?: string;
  transactionDate: string;
  productUnit: IProductUnit;
}
