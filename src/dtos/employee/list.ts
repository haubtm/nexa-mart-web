import type { EGender, ERole } from '@/lib';
import type { IResponse } from '../common';

export interface IEmployeeListRequest {
  page?: number;
  size?: number;
  keyword?: string;
  role?: ERole;
  sortDirection?: 'ASC' | 'DESC';
  sortBy?: string;
}

export interface IEmployeeListResponseData {
  employeeId: number;
  name: string;
  email: string;
  phone: string;
  role: ERole;
  dateOfBirth: string;
  gender: EGender;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  employeeCode: string;
}

export interface IEmployeeListResponse
  extends IResponse<{
    employees: IEmployeeListResponseData[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {}
