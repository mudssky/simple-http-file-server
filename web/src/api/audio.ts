import request from '../request/request'

/**
 * 获取对应路径文件的音频信息
 * @param data
 * @returns
 */
export const AUDIO_INFO = async (data: {
  path: string
}) => {
  return request.post('/audioInfo', data)
}
