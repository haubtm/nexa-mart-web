import type { IResponse } from '@/dtos';
import { AxiosError } from 'axios';

export const errorResponseInterceptor = async (
  error: AxiosError<IResponse>,
) => {
  if (error.response?.data) {
    const message = error.response?.data?.message;

    if (!message) {
      error.response.data.message = 'Unknow server error';
    }

    return Promise.reject(error.response.data);
  }

  return Promise.reject(error);
};
