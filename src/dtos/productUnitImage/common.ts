export interface IProductUnitImageResponseData {
  productUnitId: number;
  productUnitName: string;
  images: {
    id: number;
    displayOrder: number;
    isPrimary: boolean;
    isActive: boolean;
    createdAt: string;
    productUnitId: number;
    productImage: {
      imageId: number;
      imageUrl: string;
      imageAlt: string | null;
      sortOrder: number;
      createdAt: string;
      productId: number;
      variantId: number | null;
    };
  }[];
  primaryImage: {
    id: number;
    displayOrder: number;
    isPrimary: boolean;
    isActive: boolean;
    createdAt: string;
    productUnitId: number;
    productImage: {
      imageId: number;
      imageUrl: string;
      imageAlt: string | null;
      sortOrder: number;
      createdAt: string;
      productId: number;
      variantId: number | null;
    };
  };
  totalImages: number;
}

export interface IProductUnitImageAvailableResponseData {
  imageId: number;
  imageUrl: string;
  imageAlt: string | null;
  sortOrder: number;
  createdAt: string;
  productId: number;
  variantId: number | null;
}
