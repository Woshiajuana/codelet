import type { Loose } from '@daysnap/types'
import { parseQuery } from '../utils'
import { createBehavior } from '../create'

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
    parseQuery,
  },
})
