interface ISupplier {
  supplierId: number;
  code: string;
  name: string;
  email?: string;
  phone?: string;
  isActive: boolean;
}

interface IImportDetail {
  importDetailId: number;
  quantity: number;
  createdAt: string;
  productUnit: {
    productUnitId: number;
    code?: string;
    barcode?: string;
    conversionValue: number;
    productName: string;
    unit: string;
  };
}

interface ICreateBy {
  employeeId: number;
  name: string;
  email: string;
  role: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IImportsResponseData {
  importId: number;
  importCode: string;
  importDate: string;
  notes?: string;
  createdAt: string;
  supplier: ISupplier;
  createdBy: ICreateBy;
  importDetails: IImportDetail[];
  totalQuantity: number;
  totalVariants: number;
}
