import { AxiosProgressEvent, CancelToken, AxiosRequestConfig } from 'axios';

import { GetFileList } from './interface';
import { Prefix } from '@/store/task.store';

import Requset from '../request';

export default class FileAPI {
  private static readonly PRE_URL = '/file';
  private static readonly SHARED_PRE_URL = `/shared${this.PRE_URL}`;

  public static GetFileList(path: string) {
    return Requset.Get<GetFileList[]>(`${this.PRE_URL}/list`, { prefix: encodeURIComponent(path) });
  }

  public static UploadFile(
    prefix: Prefix,
    file: File,
    onUploadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
  ) {
    const preURL = prefix.sharedID ? this.SHARED_PRE_URL : this.PRE_URL;
    const config: AxiosRequestConfig = {
      params: {
        id: prefix.sharedID ? prefix.sharedID : undefined,
        prefix: encodeURIComponent(prefix.path.slice(1)),
      },
      timeout: 1000 * 60 * 60 * 24 * 365, // 365 days
      onUploadProgress,
      cancelToken,
    };
    return Requset.PostForm(`${preURL}/upload`, { file }, config);
  }

  public static DownloadFile(
    prefix: Prefix,
    fileName: string,
    onDownloadProgress?: (event: AxiosProgressEvent) => void,
    cancelToken?: CancelToken,
  ) {
    const preURL = prefix.sharedID ? this.SHARED_PRE_URL : this.PRE_URL;
    const data = {
      id: prefix.sharedID,
      prefix: prefix.path.slice(1),
      fileName,
    };
    const config: AxiosRequestConfig = {
      responseType: 'blob',
      timeout: 1000 * 60 * 60 * 24 * 365, // 365 days
      onDownloadProgress,
      cancelToken,
    };
    return Requset.PostBlob(`${preURL}/download`, data, config);
  }

  public static DeleteFile(path: string, fileName: string, sharedId?: number) {
    const params = {
      id: sharedId ? sharedId : undefined,
      prefix: encodeURIComponent(path),
      fileName: encodeURIComponent(fileName),
    };
    return Requset.Delete(`${this.PRE_URL}/remove`, params);
  }

  public static PreviewFile(
    prefix: Prefix,
    fileName: string,
    signal?: AbortSignal,
  ) {
    const preURL = prefix.sharedID ? this.SHARED_PRE_URL : this.PRE_URL;
    const data = {
      id: prefix.sharedID,
      prefix: prefix.path.startsWith('/') ? prefix.path.slice(1) : prefix.path,
      fileName,
    };
    return Requset.PostStream(`${preURL}/preview`, JSON.stringify(data), signal);
  }
}