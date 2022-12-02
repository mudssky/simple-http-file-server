/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

export const SERVER_URL = '/api'

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
export const getFileList = async (data: {
  path: string
}): PromiseResponseData<FileItem[]> => {
  return request.post(`${SERVER_URL}/filelist`, data)
}

/**
 * 创建文件夹
 * @param params
 * @returns
 */
export const mkdir = async (data: {
  path: string //文件夹路径
}): PromiseResponseData<any> => {
  return request.post(`${SERVER_URL}/mkdir`, data)
}

/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const removeItem = async (data: {
  path: string
}): PromiseResponseData<any> => {
  return request.post(`${SERVER_URL}/removeItem`, data)
}
/**
 * 创建txt文件
 * @param params
 * @returns
 */
export const createTxt = async (data: {
  path: string //文件路径
  content: string //文件内容
}): PromiseResponseData<any> => {
  return request.post(`${SERVER_URL}/createTxt`, data)
}
