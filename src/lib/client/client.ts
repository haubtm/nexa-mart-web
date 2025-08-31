import type { CreateAxiosDefaults } from 'axios';
import { ApiService } from '../services';
import { authApi } from '@/api';
import { errorResponseInterceptor, requestInterceptor } from './interceptors';

export class Client {
  protected apiService: ApiService;
  public auth: typeof authApi;

  constructor(config?: CreateAxiosDefaults) {
    this.apiService = new ApiService(config);
    this.apiService.addRequestInterceptor(requestInterceptor);
    this.apiService.addResponseInterceptor(undefined, errorResponseInterceptor);
    this.auth = authApi;
  }
}
