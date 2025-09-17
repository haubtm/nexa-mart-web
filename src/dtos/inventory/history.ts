import type { IPageable, IResponse } from '../common';

interface IInventoryHistoryResponseData {
  time: string;
  actualQuantity: number;
  totalDifference: number;
  increaseQuantity: number;
  decreaseQuantity: number;
  note?: string;
  variantId: number;
  variantCode: string;
  variantName: string;
  warehouseId: number;
  warehouseName: string;
  transactionId: number;
  referenceId?: string;
}

export type IInventoryHistoryResponse = IResponse<
  { content: IInventoryHistoryResponseData[] } & IPageable
>;
