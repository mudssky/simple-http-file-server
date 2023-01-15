import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

// /**
//  * 获取音频信息列表
//  * @param params
//  * @returns
//  */
// export const AUDIO_LIST = async (data: {
//   path: string
// }): PromiseResponseData<unknown> => {
//   return request.post(`${PROXY_SUFFIX}/audioList`, data)
// }

/**
 * 获取对应路径文件的音频信息
 * @param data
 * @returns
 */
export const AUDIO_INFO = async (data: {
  path: string
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/audioInfo`, data)
}
