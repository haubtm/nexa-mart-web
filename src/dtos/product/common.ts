interface IAttribute {
  id: number;
  variantId: number;
  attributeValueId: number;
  attributeName: string;
  attributeValue: string;
  attributeValueDescription: string;
  createdDate: string;
}

interface ICategory {
  id: number;
  name: string;
}

interface IUnit {
  id: number;
  code: string;
  unit: string;
  conversionValue: number;
}

interface IVariant {
  variantId: number;
  variantName: string;
  variantCode: string;
  barcode: string;
  costPrice: number;
  basePrice: number;
  quantityOnHand: number;
  quantityReserved: number;
  availableQuantity: number;
  minQuantity: number;
  allowsSale: boolean;
  isActive: boolean;
  needsReorder: boolean;
  createdAt: string;
  updatedAt: string;
  unit: IUnit;
  attributes: IAttribute[];
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
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  category: ICategory;
  variant: IVariant[];
}
