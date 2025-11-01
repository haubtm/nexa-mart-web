interface ICategory {
  id: number;
  name: string;
}

interface IBrand {
  id: number;
  name: string;
}

interface IUnit {
  id?: number;
  barcode?: string;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  unitName: string;
}

export interface IProductResponseData {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdDate: string;
  updatedAt: string;
  category: ICategory;
  categoryId: number;
  brandId: number;
  brand: IBrand;
  unitCount: number;
  imageCount: number;
  mainImageUrl: string;
  units: IUnit[];
}

export interface IUnitResponseData {
  id: number;
  code: string;
  barcode: string;
  conversionValue: number;
  isBaseUnit: boolean;
  isActive: boolean;
  unit: {
    id: number;
    name: string;
    isActive: boolean;
    isDeleted: boolean;
    createAt: string;
    updateAt: string;
  };
  productId: number;
  createdAt: string;
  updatedAt: string;
}
