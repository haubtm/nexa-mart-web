import { ECustomerType, EGender } from '@/lib';
import type { IResponse } from '../common';
import type { ICustomerResponseData } from './common';

export interface ICustomerUpdateRequest {
  customerId: number;
  name: string;
  email: string;
  phone: string;
  gender: EGender;
  address: string;
  dateOfBirth: string;
  customerType: ECustomerType;
  customerCode: string;
}

export interface ICustomerUpdateResponse
  extends IResponse<ICustomerResponseData> {}
