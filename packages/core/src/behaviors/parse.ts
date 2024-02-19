import type { Loose } from '@daysnap/types'
import { createBehavior } from '../create'
import { isString, parseQueryString } from '@daysnap/utils'

type ParseEvent = Loose<WechatMiniprogram.CustomEvent | WechatMiniprogram.BaseEvent>

export const ParseBehavior = createBehavior({
  methods: {
    /**
     * 转化点击事件解析参数
     */
    parseEvent(event: ParseEvent) {
      const { detail = {}, currentTarget } = event
      const { dataset } = currentTarget
      return {
        ...dataset,
        ...detail,
      }
    },

    /**
     * 打开当前页面路径中的参数
     *
     * let { query = {}, scene, ...rest } = options
     * 包含了 query 和 scene 参数，优先级 rest > scene > query
     */
    parseQuery<T extends Record<string, any>>(options: Record<string, any>) {
      // eslint-disable-next-line prefer-const
      let { query = {}, scene, ...rest } = options
      if (isString(query)) {
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
    },
  },
})
