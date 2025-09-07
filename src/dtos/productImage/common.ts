export interface IProductImageResponseData {
  imageId: number;
  imageUrl: string;
  imageAlt?: string | null;
  sortOrder: number;
  createdAt: string;
  productId: number;
  variantId?: number | null;
  fileSize?: number;
  contentType?: string;
}
