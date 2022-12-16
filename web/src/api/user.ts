import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

/**
 * 用户登录
 * @param params
 * @returns
 */
export const LOGIN = async (data: {
  username: string
  password: string
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/login`, data)
}
