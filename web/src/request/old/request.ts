/* eslint-disable @typescript-eslint/no-explicit-any */
function objToUrlparam(obj: any) {
  const list = Object.keys(obj).map((key) => {
    return `${key}=${obj[key]}`
  })
  if (list.length == 0) {
    return ''
  } else {
    return '?' + encodeURIComponent(list.join('&'))
  }
}
const fetchBaseConfig: RequestInit = {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
  },
}
export type ContentType = 'multipart/form-data' | 'application/json'
export async function get(url: string, param?: any) {
  return (
    await fetch(url + param ? objToUrlparam(param) : '', {
      method: 'GET',
      ...fetchBaseConfig,
    })
  ).json()
}

export async function post(
  url: string,
  body?: any,
  contentType: ContentType = 'application/json'
) {
  console.log({ url, body })
  const data = await fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : '{}',
    headers: {
      'Content-Type': contentType,
    },
  })
  const json = await data.json()
  // console.log('json', json)
  return json
}

/**
 * 因为fetch api没有支持上传进度，所以用xhr封装了一个上传的函数
 * @param url
 * @param files
 * @param onProgress
 * @returns
 */
export const uploadFiles = (
  url: string,
  files: any,
  options?: {
    onProgress?: (loaded: number, total: number) => void
    infoDict?: { [key: string]: string } //后端需要的信息，比如文件保存的路径
  }
) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.upload.addEventListener('progress', (e) =>
      options?.onProgress?.(e.loaded, e.total)
    )
    xhr.addEventListener('load', () =>
      resolve({ status: xhr.status, body: xhr.responseText })
    )
    xhr.addEventListener('error', () => reject(new Error('File upload failed')))
    xhr.addEventListener('abort', () =>
      reject(new Error('File upload aborted'))
    )
    xhr.open('POST', url, true)
    // xhr.setRequestHeader('Content-Type', 'multipart/form-data')
    const formData = new FormData()
    console.log('files', files)
    if (options) {
      Object.keys(options.infoDict ?? {}).forEach((key: string) => {
        formData.append(key, options?.infoDict?.[key] ?? '')
      })
    }

    Array.from(files).forEach((file: any, index) =>
      formData.append(index.toString(), file)
    )
    xhr.send(formData)
  })
