import axios, { AxiosRequestConfig as Config, AxiosResponse } from 'axios';

import { ApiResult, Response } from './types';

import Router, { routes } from '@/router';
import UserService from '@/services/user.service';

const baseURL = 'https://www.calicomoomoo.com/otter-cloud-ws';
const request = axios.create({
  baseURL,
  timeout: 1000 * 60 * 5, // 5 min
  headers: {
    'Content-Type': 'application/json',
  },
});

request.interceptors.request.use((config) => {
  const token = UserService.GetToken();
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  (resp) => {
    if (200 <= resp.status && resp.status <= 299) {
      if (resp.data?.status) {
        switch (resp.data.status) {
          case ApiResult.Success:
            return resp;
          case ApiResult.TokenError:
            Router.navigate(routes.login);
        }
      }
      return resp;
    }
    return Promise.reject(resp);
  },
  (error) => {
    let errorMsg = '';
    if (error.message) errorMsg = error.message;
    if (error.response?.data) errorMsg = error.response?.data;
    if (errorMsg) console.error('api error:', errorMsg);

    return Promise.reject(error);
  },
);

export default class Request {
  public static Get<T = unknown>(url: string, params?: unknown, config?: Config): Promise<AxiosResponse<Response<T>>> {
    const _config: Config = config || {};
    if (params) _config.params = params;
    return request.get<Response<T>>(url, _config);
  }

  public static Post<T = unknown>(url: string, data?: unknown, config?: Config): Promise<AxiosResponse<Response<T>>> {
    return request.post<Response<T>>(url, data, config);
  }

  public static PostBlob(url: string, data?: unknown, config?: Config): Promise<AxiosResponse<Blob>> {
    const _config: Config = config || {};
    _config.responseType = 'blob';
    return request.post(url, data, _config);
  }

  public static PostForm<T = unknown>(
    url: string,
    data?: unknown,
    config?: Config,
  ): Promise<AxiosResponse<Response<T>>> {
    return request.postForm<Response<T>>(url, data, config);
  }

  public static PostStream(url: string, body?: BodyInit, signal?: AbortSignal): Promise<globalThis.Response> {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    const token = UserService.GetToken();
    token && (headers.Authorization = `Bearer ${token}`);
    return fetch(baseURL + url, {
      method: 'POST',
      headers,
      body,
      signal,
    });
  }

  public static Delete<T = unknown>(
    url: string,
    params?: unknown,
    config?: Config,
  ): Promise<AxiosResponse<Response<T>>> {
    const _config: Config = config || {};
    if (params) _config.params = params;
    return request.delete<Response<T>>(url, _config);
  }
}
