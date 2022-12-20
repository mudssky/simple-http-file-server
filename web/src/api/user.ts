import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'
import { PermissionType } from '../store/reducer/userReducer'

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

/**
 * 用户登录
 * @param params
 * @returns
 */
export const GET_PERMISSION = async (): PromiseResponseData<
  PermissionType[]
> => {
  return request.get(`${PROXY_SUFFIX}/getWebpermission`)
}
