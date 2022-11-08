export interface ResponseData<T> {
  code: 0 | 1
  data: T
  msg: string
}

export type PromiseResponseData<T> = Promise<ResponseData<T>>
