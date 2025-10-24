import type { ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeByIdRequest {
  id: number;
}

export interface IEmployeeByIdResponseData {
  employeeId: number;
  name: string;
  email: string;
  role: ERole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employeeCode: string;
}

export interface IEmployeeByIdResponse
  extends IResponse<IEmployeeByIdResponseData> {}
