import { ETransaction } from '@/lib';
import type { IResponse } from '../common';

export interface IInventoryUpdateRequest {
  variantId: number;
  warehouseId: number;
  quantityChange: number;
  transactionType: ETransaction;
  unitCostPrice?: number;
  referenceId?: string;
  notes?: string;
}

interface IInventoryUpdateResponseData {
  inventoryId: number;
  variantId: number;
  variantCode: string;
  variantName: string;
  warehouseId: number;
  warehouseName: string;
  quantityOnHand: number;
  quantityReserved: number;
  availableQuantity: number;
  reorderPoint: number;
  needsReorder: boolean;
  updatedAt: string;
}

export interface IInventoryUpdateResponse
  extends IResponse<IInventoryUpdateResponseData> {}
