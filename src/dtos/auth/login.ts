import type { IResponse } from '../common';

export interface ILoginRequest {
  email: string;
  password: string;
}

interface IResponseData {
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  employee?: {
    employeeId?: number;
    name?: string;
    email?: string;
    role?: string;
  };
}

export interface ILoginResponse extends IResponse<IResponseData> {}
