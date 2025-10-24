import type { ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeListResponseData {
  employeeId: number;
  name: string;
  email: string;
  role: ERole;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employeeCode: string;
}

export interface IEmployeeListResponse
  extends IResponse<IEmployeeListResponseData[]> {}
