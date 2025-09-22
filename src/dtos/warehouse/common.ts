export interface IWarehouseResponseData {
  warehouseId: number;
  quantityOnHand: number;
  updatedAt: string;
  variant: {
    variantId: number;
    variantName: string;
    variantCode?: string | null;
    barcode?: string | null;
    productName: string;
    unit: string;
  };
}
