import type { ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeCreateRequest {
  name: string;
  email: string;
  passwordHash: string;
  role: ERole;
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
