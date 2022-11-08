function objToUrlparam(obj: any) {
  const list = Object.keys(obj).map((key) => {
    return `${key}=${obj[key]}`
  })
  if ((list.length = 0)) {
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

export async function get(url: string, param?: any) {
  return (
    await fetch(url + param ? objToUrlparam(param) : '', {
      method: 'GET',
      ...fetchBaseConfig,
    })
  ).json()
}

export async function post(url: string, body?: any) {
  console.log({ url, body })
  const data = await fetch(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : '{}',
    ...fetchBaseConfig,
  })
  const json = await data.json()
  console.log('json', json)

  return json
}
