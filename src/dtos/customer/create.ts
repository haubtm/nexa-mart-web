import { ECustomerType, EGender } from '@/lib';
import type { IResponse } from '../common';
import type { ICustomerResponseData } from './common';
import { Dayjs } from 'dayjs';

export interface ICustomerCreateRequest {
  name: string;
  email: string;
  phone: string;
  gender: EGender;
  address: string;
  dateOfBirth: string | Dayjs | null;
  customerType: ECustomerType;
  customerCode: string;
}

export interface ICustomerCreateResponse
  extends IResponse<ICustomerResponseData> {}
