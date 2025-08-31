import { ROUTE_PATH } from '@/common';
import { ApiService, clearStorage, getStorageItem, STORAGE_KEY } from '@/lib';
import { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { IResponse } from '../dtos';

const requestInterceptor = async (config: InternalAxiosRequestConfig) => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);
  config.headers.Authorization = `Bearer ${token}`;
  return config;
};

export const errorResponseInterceptor = async (
  error: AxiosError<IResponse>,
) => {
  if (error.response?.data) {
    const currentPath = window.location.pathname;
    if (
      error.response.status === 401 &&
      currentPath !== ROUTE_PATH.AUTH.LOGIN.PATH()
    ) {
      window.location.href = ROUTE_PATH.AUTH.LOGIN.PATH();
      clearStorage();
      return Promise.reject(error.response.data);
    }

    const message = error.response?.data?.message;

    if (!message) {
      error.response.data.message = 'Unknow server error';
    }

    return Promise.reject(error.response.data);
  }

  return Promise.reject(error);
};

export const apiService = new ApiService({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
});

apiService.addRequestInterceptor(requestInterceptor);
apiService.addResponseInterceptor(undefined, errorResponseInterceptor);
