// 后端静态资源路径的前缀
export const STATIC_SERVER_PREFIX = '/static/'

export function getServerStaticUrl(link: string) {
  return STATIC_SERVER_PREFIX + link
}
