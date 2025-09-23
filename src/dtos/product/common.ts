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
interface IImage {
  imageId: number;
  imageUrl: string;
  imageAlt: string;
  sortOrder: number;
  createdAt: string;
  productId: number;
  variantId: number;
}

export interface IVariant {
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
  images: IImage[];
}

export interface IProductResponseData {
  id: number;
  name: string;
  description: string;
  variantCount: number;
  isActive: boolean;
  createdDate: string;
  updatedAt: string;
  category: ICategory;
  brand: IBrand;
  variants: IVariant[];
}
