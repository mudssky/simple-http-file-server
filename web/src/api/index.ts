import { PromiseResponseData } from '../global'
import { post } from '../util/request'

export const SERVER_URL = 'http://127.0.0.1:7888'

export interface FileItem {
  name: string
  lastModTime: number
  path: string
  isFolder: boolean
  size: number
}

/**
 * 获取文件列表
 * @param params
 * @returns
 */
export const getFileList = async (params: {
  path: string
}): PromiseResponseData<FileItem[]> => {
  return post(`${SERVER_URL}/filelist`, params)
}

/**
 * 创建文件夹
 * @param params
 * @returns
 */
export const mkdir = async (params: {
  path: string //文件夹路径
}): PromiseResponseData<any> => {
  return post(`${SERVER_URL}/mkdir`, params)
}

/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const removeItem = async (params: {
  path: string
}): PromiseResponseData<any> => {
  return post(`${SERVER_URL}/removeItem`, params)
}
/**
 * 创建txt文件
 * @param params
 * @returns
 */
export const createTxt = async (params: {
  path: string //文件路径
  content: string //文件内容
}): PromiseResponseData<any> => {
  return post(`${SERVER_URL}/createTxt`, params)
}
