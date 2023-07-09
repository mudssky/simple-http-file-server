import request from '../request/request'

export interface ServerInfo {
  localIpList: string[]
  port: number
}
/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const GET_SERVER_INFO = async () => {
  return request.get<ServerInfo>('/getServerInfo')
}
