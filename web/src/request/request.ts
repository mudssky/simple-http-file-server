import { notification } from 'antd'
import axios, {
  AxiosInstance,
  AxiosProgressEvent,
  AxiosRequestConfig,
} from 'axios'
import { LoginRes } from '../api/user'
import { getLocalstorage } from '../util/localStorage'

export function createGlobalAxiosWithInterceptors(
  config?: AxiosRequestConfig,
): AxiosInstance {
  const axiosInstance = axios.create({
    // timeout: 3000, //超时配置
    withCredentials: true, //跨域携带cookie
    ...config, // 自定义配置覆盖基本配置
  })
  // 添加请求拦截器
  axiosInstance.interceptors.request.use(
    function (config) {
      // 在发送请求之前做些什么
      //   console.log('config:', config)
      const loginStoraged = getLocalstorage('userInfo') as LoginRes | null
      // 取得token以后进行添加
      if (loginStoraged) {
        // 添加Authorization请求头用于登录认证
        const { token } = loginStoraged
        if (token && config.headers) {
          ;(config.headers as { [key: string]: unknown })['x-token'] = token
        }
      }

      return config
    },
    function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    },
  )

  // 添加响应拦截器
  axiosInstance.interceptors.response.use(
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
    function (error) {
      // 任何超过2xx范围的状态码，会触发这个函数
      console.error({
        ...error,
      })
      if (error.response) {
        notification.error({
          message: error.response.status,
          description: error?.response?.data?.msg ?? '服务端异常',
        })
        // switch (error.response.status) {
        // }
      }
      // return Promise.reject(error)
    },
  )
  return axiosInstance
}

export type ContentType = 'multipart/form-data' | 'application/json'

export const request = createGlobalAxiosWithInterceptors()

export const BaseHeader = {
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
}

export function uploadFile(
  url: string,
  file: string | Blob,
  options?: {
    fieldName?: string
    onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
  },
) {
  const { fieldName = 'file', onUploadProgress } = options ?? {}
  const formData = new FormData()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formData.append(fieldName, file)
  return request.post(url, formData, {
    onUploadProgress: onUploadProgress,
  })
}

/**
 * 使用bolb方式下载
 * @param res
 * @param filename
 * @returns
 */
export function downloadFile(res: Blob, filename: string) {
  const url = window.URL.createObjectURL(new Blob([res]))
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url) // 释放blob对象
}
