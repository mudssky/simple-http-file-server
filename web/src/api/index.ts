/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd'
import { PromiseResponseData } from '../global'
import { downloadFile, request } from '../request/request'
import { handleDownloadProgress } from '../util/util'

export const PROXY_SUFFIX = '/api'

export interface FileItem {
  name: string
  lastModTime: number
  path: string
  isFolder: boolean
  size: number
  link: string
  rootPath: string
  rootPathEncode: string
}

/**
 * 获取文件列表
 * @param params
 * @returns
 */
export const GET_FILELIST = async (data: {
  path: string
}): PromiseResponseData<FileItem[]> => {
  return request.post(`${PROXY_SUFFIX}/filelist`, data)
}

/**
 * 创建文件夹
 * @param params
 * @returns
 */
export const MKDIR = async (data: {
  path: string //文件夹路径
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/mkdir`, data)
}

/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const REMOVE_ITEM = async (data: {
  path: string
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/removeItem`, data)
}
/**
 * 创建txt文件
 * @param params
 * @returns
 */
export const CREATE_TXT = async (data: {
  path: string //文件路径
  content: string //文件内容
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/createTxt`, data)
}

export const RENAME_ITEM = async (data: {
  path: string //文件路径
  newName: string //新文件名
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/renameItem`, data)
}

export const DOWNLOAD_ITEM = async (data: FileItem) => {
  const resP = await request.post(`${PROXY_SUFFIX}/downloadItem`, data, {
    responseType: 'blob',
    onDownloadProgress: handleDownloadProgress,
  })
  const res = resP.data
  // json的情况说明是报错
  if (res.type !== 'application/json') {
    const filename =
      resP.headers?.['content-disposition']?.split('=')?.at(-1) ?? data.name
    downloadFile(res, filename)
    // if (res.type === 'application/zip') {
    //   downloadFile(res, `${data.name}.zip`)
    // } else {
    //   downloadFile(res, data.name)
    // }
  } else {
    const r = await res.text()
    message.error(JSON.parse(r)?.msg)
  }
}
