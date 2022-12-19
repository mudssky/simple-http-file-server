// localstorage类型key
export type LocalstorageTypeKey = 'userInfo'

// 设置Localstorage
export function setLocalstorage<T>(key: LocalstorageTypeKey, data: T) {
  localStorage.setItem(key, JSON.stringify(data))
}
// 获取Localstorage
export const getLocalstorage = (key: LocalstorageTypeKey): unknown => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}

// 清除Localstorage
export const delLocalStorage = (key: LocalstorageTypeKey) => {
  localStorage.removeItem(key)
}
