/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type {
  AxiosError,
  AxiosInstance,
  AxiosProgressEvent,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { delLocalStorage, getLocalstorage } from '../util/localStorage'
import { LoginRes } from '../api/user'
import { notification } from 'antd'

// 封装后端返回值类型
export type ResponseData<T> = {
  code: number
  msg: string
  data: T
}

export function downloadFile(res: Blob, filename: string) {
  const blobUrl = window.URL.createObjectURL(new Blob([res]))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(blobUrl) // 释放blob对象
}

/**
 * 将文件大小数字使用合适的单位格式化。
 * @param filesize  字节大小
 * @param decimalPlaces  小数位数
 * @returns
 */
export function filesizeFormatter(filesize: number, decimalPlaces = 2) {
  const sizedict = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  }
  type SizeUnit = keyof typeof sizedict
  let unit: Uppercase<SizeUnit> = 'B'
  if (filesize >= sizedict.pb) {
    unit = 'PB'
  } else if (filesize >= sizedict.tb) {
    unit = 'TB'
  } else if (filesize >= sizedict.gb) {
    unit = 'GB'
  } else if (filesize >= sizedict.mb) {
    unit = 'MB'
  } else if (filesize >= sizedict.kb) {
    unit = 'KB'
  } else {
    unit = 'B'
  }
  return (
    (filesize / sizedict[unit.toLowerCase() as SizeUnit]).toFixed(
      decimalPlaces,
    ) + unit
  )
}
/**
 * 格式化下载进度log信息
 * @param progressEvent
 * @returns
 */
export function formatProgressMsg(progressEvent: AxiosProgressEvent) {
  return `下载进度:${((progressEvent.progress ?? 0) * 100).toPrecision(
    4,
  )}% Speed:${filesizeFormatter(progressEvent.rate ?? 0)}/s`
}

/**
 * 通用处理下载进度的函数
 * @param progressEvent
 */
export function handleDownloadProgress(progressEvent: AxiosProgressEvent) {
  const progressMsg = formatProgressMsg(progressEvent)
  console.log(progressMsg)
}

export class Request {
  // axios 实例
  private instance: AxiosInstance
  // 默认配置
  private baseConfig = {
    baseURL: '/api',
    timeout: 5000,
    withCredentials: true,
  }

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(Object.assign(this.baseConfig, config))

    // 请求拦截器
    this.instance.interceptors.request.use(
      function (config) {
        const loginStorage = getLocalstorage('userInfo') as LoginRes | null
        // 取得token以后进行添加
        if (loginStorage) {
          // 添加Authorization请求头用于登录认证
          const { token } = loginStorage
          if (token && config.headers) {
            ;(config.headers as { [key: string]: unknown })['x-token'] = token
          }
        }
        return config
      },
      function (error: AxiosError) {
        // 请求错误，这里可以用全局提示框进行提示
        return Promise.reject(error)
      },
    )

    // 添加响应拦截器
    this.instance.interceptors.response.use(
      function (response) {
        // 对响应数据做点什么
        console.log(
          `%c${response.config.url}`,
          'background:#2d8cf0; padding: 2px; border-radius: 4px;color: #fff;',
          response.data,
          {
            response,
          },
        )
        if (response.request.responseType === 'blob') {
          return response
        }
        return response.data
      },
      // 任何超过2xx范围的状态码，会触发这个函数
      // 这里用来处理http常见错误，进行全局提示
      function (error) {
        let message = ''
        switch (error.response.status) {
          case 400:
            message = '请求错误(400)'
            break
          case 401:
            message = '未授权，请重新登录(401)'
            // 这里可以做清空storage并跳转到登录页的操作
            delLocalStorage('userInfo')
            window.location.reload()
            break
          case 403:
            message = '拒绝访问(403)'
            break
          case 404:
            message = '请求出错(404)'
            break
          case 408:
            message = '请求超时(408)'
            break
          case 500:
            message = '服务器错误(500)'
            break
          case 501:
            message = '服务未实现(501)'
            break
          case 502:
            message = '网络错误(502)'
            break
          case 503:
            message = '服务不可用(503)'
            break
          case 504:
            message = '网络超时(504)'
            break
          case 505:
            message = 'HTTP版本不受支持(505)'
            break
          default:
            message = `连接出错(${error.response.status})!`
        }
        if (error.response) {
          notification.error({
            message: message,
            description: error?.response?.data?.msg ?? '服务端异常',
          })
        }
      },
    )
  }

  // 定义核心请求
  public request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config)
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return this.instance.get(url, config)
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  public post<T = any>(
    url: string,
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return this.instance.post(url, data, config)
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  public put<T = any>(
    url: string,
    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return this.instance.put(url, data, config)
  }

  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ResponseData<T>> {
    return this.instance.delete(url, config)
  }
}

export default new Request({})
