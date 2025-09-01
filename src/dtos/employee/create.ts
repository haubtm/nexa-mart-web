import type { ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeCreateRequest {
  name: string;
  email: string;
  passwordHash: string;
  role: ERole;
  createdAt?: string;
  updatedAt?: string;
}

interface IResponseData {
  employeeId: number;
  name: string;
  email: string;
  role: ERole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployeeCreateResponse extends IResponse<IResponseData> {}
