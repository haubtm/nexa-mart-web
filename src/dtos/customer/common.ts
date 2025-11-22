import { ECustomerType, EGender } from '@/lib';

export interface ICustomerResponseData {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  gender: EGender;
  address: string;
  wardCode?: string | number;
  provinceCode?: string | number;
  dateOfBirth: string;
  customerType: ECustomerType;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customerCode: string;
}
