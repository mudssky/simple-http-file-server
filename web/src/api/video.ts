import { PROXY_SUFFIX } from '.'
import { PromiseResponseData } from '../global'
import { request } from '../request/request'

/**
 * 获取vtt字幕
 * @param params
 * @returns
 */
export const GET_VTT_SUBTITLE = async (data: {
  path: string
}): PromiseResponseData<unknown> => {
  return request.post(`${PROXY_SUFFIX}/getVttSubtitle`, data)
}
