import type { EGender, ERole } from '@/lib';
import type { IResponse } from '../common';
import type { Dayjs } from 'dayjs';

export interface IEmployeeCreateRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: ERole;
  dateOfBirth: string | Dayjs | null;
  gender: EGender;
  employeeCode: string;
}

interface IResponseData {
  employeeId: number;
  name: string;
  email: string;
  role: ERole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employeeCode: string;
}

export interface IEmployeeCreateResponse extends IResponse<IResponseData> {}
