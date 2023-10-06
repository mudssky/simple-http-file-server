/* eslint-disable @typescript-eslint/no-explicit-any */
import { message } from 'antd'
import request, {
  downloadFile,
  handleDownloadProgress,
} from '../request/request'
import { AxiosResponse } from 'axios'
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
export const GET_FILELIST = async (data: { path: string }) => {
  return request.post<FileItem[]>('/filelist', data)
}

/**
 * 创建文件夹
 * @param params
 * @returns
 */
export const MKDIR = async (data: {
  path: string //文件夹路径
}) => {
  return request.post('/mkdir', data)
}

/**
 * 删除文件或文件夹
 * @param params
 * @returns
 */
export const REMOVE_ITEM = async (data: { path: string }) => {
  return request.post('/removeItem', data)
}
/**
 * 创建txt文件
 * @param params
 * @returns
 */
export const CREATE_TXT = async (data: {
  path: string //文件路径
  content: string //文件内容
}) => {
  return request.post('/createTxt', data)
}

export const RENAME_ITEM = async (data: {
  path: string //文件路径
  newName: string //新文件名
}) => {
  return request.post('/renameItem', data)
}

export const DOWNLOAD_ITEM = async (data: FileItem) => {
  const resP = (await request.post('/downloadItem', data, {
    responseType: 'blob',
    onDownloadProgress: handleDownloadProgress,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  })) as unknown as AxiosResponse<any>
  const res = resP.data
  // json的情况说明是报错
  if (res.type !== 'application/json') {
    const filenamePatten = /filename(\*=.*?'.*?')?(.*?)$/
    const encodedFileName = filenamePatten.exec(
      resP.headers?.['content-disposition'],
    )?.[2]
    const filename = encodedFileName
      ? decodeURIComponent(encodedFileName)
      : data.name

    downloadFile(res, filename)
  } else {
    const r = await res.text()
    message.error(JSON.parse(r)?.msg)
  }
}
