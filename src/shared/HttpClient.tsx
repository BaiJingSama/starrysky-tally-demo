import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { mockSession } from "../mock/mock";

type GetConfig = Omit<AxiosRequestConfig, "params" | "url" | "method">;
type PostConfig = Omit<AxiosRequestConfig, "url" | "data" | "method">;
type PatchConfig = Omit<AxiosRequestConfig, "url" | "data">;
type DeleteConfig = Omit<AxiosRequestConfig, "params">;

export class HttpClient {
  instance: AxiosInstance;
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
    });
  }
  // read
  get<R = unknown>(
    // R表示get请求返回的response的data的类型，可以传可以不传
    url: string,
    query?: Record<string, JSONValue>,
    config?: GetConfig
    // Omit从第一个参数中删除第二个参数（属性名）
  ) {
    return this.instance.request<R>({
      ...config,
      url: url,
      params: query,
      method: "get",
    });
  }
  // create
  post<R = unknown>(
    url: string,
    data?: Record<string, JSONValue>,
    config?: PostConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      data,
      method: "post",
    });
  }
  // update
  patch<R = unknown>(
    url: string,
    data?: Record<string, JSONValue>,
    config?: PatchConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      data,
      method: "patch",
    });
  }
  // destroy
  delete<R = unknown>(
    url: string,
    query?: Record<string, string>,
    config?: DeleteConfig
  ) {
    return this.instance.request<R>({
      ...config,
      url,
      params: query,
      method: "delete",
    });
  }
}

const mock = (response: AxiosResponse) => {
  if (
    location.hostname !== "localhost" &&
    location.hostname !== "127.0.0.1" &&
    location.hostname !== "192.168.3.57"
  ) {
    return false;
  }
  switch (response.config?.params?._mock) {
    case "session":
      [response.status, response.data] = mockSession(response.config);
      return true;
  }
  return false;
};

export const http = new HttpClient("/api/v1");

http.instance.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers!.Authorization = `Bearer ${jwt}`;
  }
  return config;
});

// request.use也可以接受两个参数，但一般只用第一个
// config是请求相关的所有配置
// 判断如果jwt存在就把jwt加到响应头里

http.instance.interceptors.response.use(
  (response) => {
    mock(response);
    return response;
  },
  (error) => {
    if (mock(error.response)) {
      return error.response;
    } else {
      throw error;
    }
  }
);

http.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 429) {
        alert("你太频繁了");
      }
    }
    throw error;
  }
);
