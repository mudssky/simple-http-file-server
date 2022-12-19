import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

export interface LoginRes {
  token: string
  userInfo: UserInfo
}
export interface UserInfo {
  username: string
}
/**
 * 用户登录
 * @param params
 * @returns
 */
export const LOGIN = async (data: {
  username: string
  password: string
}): PromiseResponseData<LoginRes> => {
  return request.post(`${PROXY_SUFFIX}/login`, data)
}
