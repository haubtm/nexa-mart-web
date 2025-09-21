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

interface IBrand {
  id: number;
  name: string;
}

interface IUnit {
  id: number;
  code: string;
  unit: string;
  conversionValue: number;
  isBaseUnit: boolean;
}

interface IVariant {
  variantId: number;
  variantName: string;
  variantCode: string;
  barcode: string;
  allowsSale: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  unit: IUnit;
  attributes: IAttribute[];
}

export interface IProductResponseData {
  id: number;
  name: string;
  description: string;
  variantCount: number;
  isActive: boolean;
  createdDate: string;
  modifiedDate: string;
  category: ICategory;
  brand: IBrand;
  variants: IVariant[];
}
