import { isString, parseQueryString } from '@daysnap/utils'

/**
 * 打开当前页面路径中的参数
 *
 * let { query = {}, scene, ...rest } = options
 * 包含了 query 和 scene 参数，优先级 rest > scene > query
 */
export function parseQuery<T extends Record<string, any>>(options: Record<string, any>) {
  // eslint-disable-next-line prefer-const
  let { query = {}, scene, ...rest } = options
  if (isString(query)) {
    query = decodeURIComponent(query)
    if (query.startsWith('%7B')) {
      // 为了兼容开发者工具的编译模式，路径参数会被 encodeURIComponent
      // 这里再一次解码下
      query = decodeURIComponent(query)
    }
    query = JSON.parse(query)
  }
  if (scene) {
    if (scene.includes('=')) {
      Object.assign(query, parseQueryString(scene))
    } else {
      Object.assign(query, { scene: decodeURIComponent(scene) })
    }
  }
  Object.assign(query, rest)

  return query as T
}
