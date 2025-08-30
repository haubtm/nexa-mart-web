export interface IBaseListRequest {
  page?: number;
  limit?: number;
}

export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}
