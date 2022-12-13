import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

export interface ServerInfo {
  localIpList: string[]
  port: number
}
/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const GET_SERVER_INFO = async (): PromiseResponseData<ServerInfo> => {
  return request.get(`${PROXY_SUFFIX}/getServerInfo`)
}
