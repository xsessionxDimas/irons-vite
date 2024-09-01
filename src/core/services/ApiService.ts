import { App } from 'vue'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'
import VueAxios from 'vue-axios'
import msalWrapperClass from './SSOService'
import { AccountInfo } from '@azure/msal-common'
import { db } from '@/database/schema/DexieSchema'
import {
  tableToArray
} from '@/database/schema/DatabaseWrapper'
import { ValidTokenNew } from "@/database/schema/ValidTokenNew";
import {
  v4 as uuidv4
} from 'uuid';

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);
    ApiService.createInterceptor();
  }

  private static getUrlAndQueryParams = (url: string) => {
  const parser = new URL(url);
  const queryString = parser.search.slice(1);
  const params = {};
  queryString.split("&").forEach((query) => {
    const [key, value] = query.split("=");
    params[key] = value;
  });
  
  return {
    url: `${parser.origin}${parser.pathname}`,
    params,
  };
};

  private static async createInterceptor() {
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { url, params } = ApiService.getUrlAndQueryParams(error.response.config.url ?? "");
        error.response.eventMeta = {
          requestId: error.response.config.headers["X-Request-Id"],
          requestUrl: url,
          param: JSON.stringify(params),
          header: JSON.stringify(error.response.config.headers),
          body: JSON.stringify(error.response.data),
          response: JSON.stringify(error.response),
        }
        return Promise.reject(error);
      }
    )
  }

  private static async getToken() {
    let tokens = await tableToArray(db, 'validTokenNew') as ValidTokenNew[]
    if (tokens[0]) {
      return tokens[0].token
    } else {
      const wrapper = msalWrapperClass.getInstance()
      try {
        await wrapper.hitSilentToken()
        tokens = await tableToArray(db, 'validTokenNew') as ValidTokenNew[]
        return tokens[0]?.token
      } catch (error) {
        console.log(error)
      }
    }
  }

  /**
   * @description set the default HTTP request headers
   */
  public static async setHeader(): Promise<void> {
    const token = await this.getToken();
    const requestId = uuidv4();
    ApiService.vueInstance.axios.defaults.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      'X-Request-Id': requestId
    };
    ApiService.vueInstance.axios.defaults.responseType = "json";
  }

  public static async setHeaderWithoutAuth(): Promise<void> {
    ApiService.vueInstance.axios.defaults.headers = {
      "Content-Type": "application/json",
    };
    ApiService.vueInstance.axios.defaults.responseType = "json";
  }

  public static async setGraphHeader(): Promise<void> {
    // always request token from msal
    const wrapper = msalWrapperClass.getInstance();
    const msal = msalWrapperClass.getMSALInstance();
    const account = JSON.parse(
      localStorage.getItem("account-info-cache") as string,
    ) as AccountInfo;
    const accessToken = await wrapper.getGraphTokenRequest(msal, account);
    ApiService.vueInstance.axios.defaults.headers = {
      Authorization: `Bearer ${accessToken.accessToken}`,
      "Content-Type": "application/json",
    };
    ApiService.vueInstance.axios.defaults.responseType = "arraybuffer";
  }

  public static async setHeaderUpload(): Promise<void> {
    const token = await this.getToken();
    ApiService.vueInstance.axios.defaults.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data; boundary=",
    };
    ApiService.vueInstance.axios.defaults.responseType = "json";
  }

  public static async setHeaderBlobFile(): Promise<void> {
    const token = await this.getToken();
    ApiService.vueInstance.axios.defaults.headers = {
      Authorization: `Bearer ${token}`,
    };
    ApiService.vueInstance.axios.defaults.responseType = "arraybuffer";
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    ApiService.setHeader();
    return ApiService.vueInstance.axios.get(resource, params).catch((error) => {
      throw new Error(`[KT] ApiService ${error}`);
    });
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static async get(
    resource: string,
    slug = "" as string,
    param = "" as string,
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    param = param ? `?${param}` : "";
    let url = `${resource}/${slug}${param}`;
    if (url[url.length - 1] == "/") {
      url = url.substring(0, url.length - 1);
    }
    return ApiService.vueInstance.axios.get(url, { timeout: 0 });
  }

  public static async getGraph(resource: string): Promise<AxiosResponse> {
    await ApiService.setGraphHeader();
    const url = `${resource}`;
    return ApiService.vueInstance.axios.get(url);
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static publicGet(
    resource: string,
    slug = "" as string,
    param = "" as string,
  ): Promise<AxiosResponse> {
    ApiService.setHeaderWithoutAuth();
    param = param ? `?${param}` : "";
    let url = `${resource}/${slug}${param}`;
    if (url[url.length - 1] == "/") {
      url = url.substring(0, url.length - 1);
    }
    return ApiService.vueInstance.axios.get(url);
  }

  /**
   * @description send the GET HTTP request for Blob type response
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static async getBlob(
    resource: string,
    slug = "" as string,
    param = "" as string,
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    await ApiService.setHeaderBlobFile();
    param = param ? `?${param}` : "";
    let url = `${resource}/${slug}${param}`;
    if (url[url.length - 1] == "/") {
      url = url.substring(0, url.length - 1);
    }
    return ApiService.vueInstance.axios.get(url);
  }

  /**
   * @description send the POST HTTP request for Blob type response
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static async postBlob(
    resource: string,
    payload: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    await ApiService.setHeaderBlobFile();
    let url = `${resource}`;
    if (url[url.length - 1] == "/") {
      url = url.substring(0, url.length - 1);
    }
    return ApiService.vueInstance.axios.post(`${resource}`, payload);
  }

  /**
   * @description set the POST HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async post<T = any>(
    resource: string,
    params: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    await ApiService.setHeader();
    return ApiService.vueInstance.axios.post(`${resource}`, params, config);
  }

  public static async postImages(
    resource: string,
    params: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse> {
    await ApiService.setHeaderUpload();
    return ApiService.vueInstance.axios.post(`${resource}`, params, config);
  }

  /**
   * @description set the POST HTTP request with file upload progress
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @param onUploadProgress: OnUploadProgress
   * @returns Promise<AxiosResponse>
   */
  public static async postWithProgress(
    resource: string,
    params: AxiosRequestConfig,
    onUploadProgress: AxiosRequestConfig["onUploadProgress"],
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    return ApiService.vueInstance.axios.post(`${resource}`, params, {
      onUploadProgress,
    });
  }

  public static async patch(
    resource: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    // TECH-DEBT: param 2 on patch function is body, not a config
    return ApiService.vueInstance.axios.patch(`${resource}`, params);
  }

  /**
   * @description send the UPDATE HTTP request
   * @param resource: string
   * @param slug: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static async update(
    resource: string,
    slug: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    await ApiService.setHeader();
    // TECH-DEBT: param 2 on put function is body, not a config
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description Send the PUT HTTP request
   * @param resource: string
   * @param params: AxiosRequestConfig
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    ApiService.setHeader();
    // TECH-DEBT: param 2 on put function is body, not a config
    return ApiService.vueInstance.axios.put(`${resource}`, params);
  }

  /**
   * @description Send the DELETE HTTP request
   * @param resource: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string): Promise<AxiosResponse> {
    ApiService.setHeader();
    return ApiService.vueInstance.axios.delete(resource).catch((error) => {
      throw new Error(`[RWV] ApiService ${error}`);
    });
  }
}

export default ApiService;
