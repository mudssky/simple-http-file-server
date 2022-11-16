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
export const getFileList = async (): PromiseResponseData<FileItem[]> => {
  return post(`${SERVER_URL}/filelist`, {
    path: 'D:/coding',
  })
}
