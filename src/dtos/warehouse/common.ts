import { ETransaction } from '@/lib';

interface IVariant {
  variantId: number;
  variantName: string;
  variantCode?: string | null;
  barcode?: string | null;
  productName: string;
  unit: string;
}

export interface IWarehouseResponseData {
  warehouseId: number;
  quantityOnHand: number;
  updatedAt: string;
  variant: IVariant;
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
  variant: IVariant;
}
