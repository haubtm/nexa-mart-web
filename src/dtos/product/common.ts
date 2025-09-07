interface IProductUnit {
  id: number;
  code: string;
  unit: string;
  basePrice: number;
  conversionValue: number;
  allowsSale: boolean;
  barcode: string;
}

interface IAttribute {
  id: number;
  attributeName: string;
  value: string;
}

interface ICategory {
  id: number;
  name: string;
}

export interface IProductResponseData {
  id: number;
  code: string;
  name: string;
  fullName: string;
  description: string;
  productType: number;
  hasVariants: boolean;
  variantCount: number;
  basePrice: number;
  cost: number;
  latestPurchasePrice: number;
  unit: string;
  conversionValue: number;
  onHand: number;
  onOrder: number;
  reserved: number;
  minQuantity: number;
  maxQuantity: number;
  barcode: string;
  tradeMarkName: string;
  allowsSale: boolean;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  category: ICategory;
  productUnits?: IProductUnit[];
  attributes?: IAttribute[];
}
