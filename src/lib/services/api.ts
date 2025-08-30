import axios, {
  type AxiosRequestConfig,
  type CreateAxiosDefaults,
} from 'axios';

export class ApiService {
  private axiosInstance;
  public addRequestInterceptor;
  public addResponseInterceptor;

  constructor(config?: CreateAxiosDefaults) {
    this.axiosInstance = axios.create({
      timeout: 30000,
      ...config,
    });

    this.addRequestInterceptor =
      this.axiosInstance.interceptors.request.use.bind(
        this.axiosInstance.interceptors.request,
      );

    this.addResponseInterceptor =
      this.axiosInstance.interceptors.response.use.bind(
        this.axiosInstance.interceptors.response,
      );
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.get<T>(url, config);

    return response.data;
  }

  public async post<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.axiosInstance.post<T>(url, body, config);

    return response.data;
  }

  public async put<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.axiosInstance.put<T>(url, body, config);

    return response.data;
  }

  public async patch<T = any>(
    url: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.axiosInstance.patch<T>(url, body, config);

    return response.data;
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    const response = await this.axiosInstance.delete<T>(url, config);

    return response.data;
  }

  public async download(
    url: string,
    fileName?: string,
    config?: AxiosRequestConfig,
  ) {
    const response = await this.get(url, {
      timeout: Infinity,
      responseType: 'blob',
      ...config,
    });

    const { data: responseData, headers: responseHeaders } = response;

    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.href = window.URL.createObjectURL(responseData);

    if (fileName) {
      a.download = fileName;
    } else {
      const contentDisposition = responseHeaders['content-disposition'];
      const matches = contentDisposition?.match(/filename\*?="?([^"]+)"?/);
      const foundFileName = matches?.at(1);

      foundFileName && (a.download = foundFileName);
    }

    a.click();

    window.URL.revokeObjectURL(url);

    a.remove();
  }
}
