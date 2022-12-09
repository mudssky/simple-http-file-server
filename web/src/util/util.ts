import { message } from 'antd'
import { AxiosProgressEvent } from 'axios'
import { ResponseData } from '../global'

export const imgPattern = /[^\s]+\.(jpg|jpeg|png|gif|bmp|webp)$/i
/**
 * 判断文件后缀名是否为 jpg|png|gif|bmp|webp的一种
 * @param filename
 */
export function isImage(filename: string): boolean {
  return imgPattern.test(filename)
}

export const path = {
  /**
   * 传入文件名，获取扩展名。 获取不到的情况下返回空字符串
   * @param filename
   * @returns
   */
  extname: (filename: string) => {
    const list = filename.split('.')
    if (list.length < 1) {
      return ''
    }
    return list.at(-1) ?? ''
  },
  dirname: (pathname: string) => {
    for (let i = pathname.length - 1; i >= 0; i--) {
      if (pathname[i] === '/') {
        return pathname.slice(0, i)
      }
    }
  },
}

/**
 * 将文件大小数字使用合适的单位格式化。
 * @param filesize  字节大小
 * @param decimalPlaces  小数位数
 * @returns
 */
export function filesizeFomatter(filesize: number, decimalPlaces = 2) {
  const sizedict = {
    b: 1,
    kb: 1 << 10,
    mb: 1 << 20,
    gb: 1 << 30,
    tb: Math.pow(1024, 4),
    pb: Math.pow(1024, 5),
  }
  type SizeUnit = keyof typeof sizedict
  let unit: Uppercase<SizeUnit> = 'B'
  if (filesize >= sizedict.pb) {
    unit = 'PB'
  } else if (filesize >= sizedict.tb) {
    unit = 'TB'
  } else if (filesize >= sizedict.gb) {
    unit = 'GB'
  } else if (filesize >= sizedict.mb) {
    unit = 'MB'
  } else if (filesize >= sizedict.kb) {
    unit = 'KB'
  } else {
    unit = 'B'
  }
  return (
    (filesize / sizedict[unit.toLowerCase() as SizeUnit]).toFixed(
      decimalPlaces,
    ) + unit
  )
}

/**
 * 对响应进行处理
 * @param res
 * @param options
 */
export function checkResponse<T>(
  res: ResponseData<T>,
  options?: {
    successCallback?: (data: T) => void
    errorCallback?: () => void
  },
) {
  if (res.code === 0) {
    message.success(res.msg)
    options?.successCallback?.(res.data)
  } else {
    message.error(res.msg)
  }
}

/**
 * 格式化下载进度log信息
 * @param progressEvent
 * @returns
 */
export function formatProgressMsg(progressEvent: AxiosProgressEvent) {
  return `下载进度:${((progressEvent.progress ?? 0) * 100).toPrecision(
    4,
  )}% Speed:${filesizeFomatter(progressEvent.rate ?? 0)}/s`
}

/**
 * 通用处理下载进度的函数
 * @param progressEvent
 */
export function handleDownloadProgress(progressEvent: AxiosProgressEvent) {
  const progressMsg = formatProgressMsg(progressEvent)
  console.log(progressMsg)
}

/**
 * gin静态服务器对一些字符需要encode
 * @param rawurl
 * @returns
 */
export function encodeURLAll(rawurl: string) {
  // const encodeDict: { [key: string]: string } = {
  //   '!': '%21',
  //   "'": '%27',
  //   '(': '%28',
  //   ')': '%29',
  //   '*': '%2A',
  // }
  const encodeDict: { [key: string]: string } = {
    '(': '%28',
    ')': '%29',
    '[': '%5B',
    ']': '%5D',
  }
  return rawurl
    .split('')
    .map((char) => {
      return encodeDict?.[char] ?? char
    })
    .join('')
  // const res = encodeURIComponent(rawurl)
  //   .split('')
  //   .map((char) => {
  //     return encodeDict?.[char] ?? char
  //   })
  //   .join('')
  // .replace(/!/g, '%21')
  // .replace(/'/g, '%27')
  // .replace(/\(/g, '%28')
  // .replace(/\)/g, '%29')
  // .replace(/\*/g, '%2A')
  // .replace(/%20/g, '+')
}
