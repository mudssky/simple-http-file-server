import request from '../request/request'
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
export const LOGIN = async (data: { username: string; password: string }) => {
  return request.post<LoginRes>('/user/login', data)
}

/**
 * 用户登录
 * @param params
 * @returns
 */
export const GET_PERMISSION = async () => {
  return request.get<PermissionType[]>('/user/getWebpermission')
}
