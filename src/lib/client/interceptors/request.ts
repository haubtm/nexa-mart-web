import { getStorageItem, STORAGE_KEY } from '@/lib';
import type { InternalAxiosRequestConfig } from 'axios';

export const requestInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const token = getStorageItem<string>(STORAGE_KEY.TOKEN);

  config.headers.Authorization = `Bearer ${token}`;

  return config;
};
