export interface IBaseListRequest {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: number;
}

export interface IResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  metadata?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: string;
}
