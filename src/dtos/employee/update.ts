import type { ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeUpdateRequest {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: ERole;
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

export interface IEmployeeUpdateResponse extends IResponse<IResponseData> {}
