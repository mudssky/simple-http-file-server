import request from '../request/request'

/**
 * 获取vtt字幕
 * @param params
 * @returns
 */
export const GET_VTT_SUBTITLE = async (data: {
  path: string
}) => {
  return request.post('/getVttSubtitle', data)
}
