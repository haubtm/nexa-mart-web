import { PriceStatus } from '@/lib';

interface IEmployee {
  employeeId: number;
  name: string;
  email: string;
}

export interface IPriceDetail {
  priceDetailId: number;
  variantId: number;
  variantCode: string;
  variantName: string;
  salePrice: number;
  createdAt: string;
  updatedAt: string;
}
export interface IPriceResponseData {
  priceId: number;
  priceName: string;
  priceCode: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: PriceStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: IEmployee;
  updatedBy: IEmployee;
  priceDetailCount: number;
  priceDetails: IPriceDetail[];
  active: boolean;
  expired: boolean;
  editable: boolean;
}
