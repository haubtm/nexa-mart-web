import { apiService } from '../axiosService';
import { type ILoginRequest, type ILoginResponse } from '@/dtos';

const BASE_ENDPOINT = '/auth';

export const authApi = {
  login: async (body: ILoginRequest) => {
    const response = await apiService.post<ILoginResponse>(
      `${BASE_ENDPOINT}/login`,
      body,
    );

    return response;
  },
};
