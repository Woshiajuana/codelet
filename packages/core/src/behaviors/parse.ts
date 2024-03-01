import { parseQuery, parseEvent } from '../utils'
import { createBehavior } from '../create'

export const ParseBehavior = createBehavior({
  methods: {
    /**
     * 转化点击事件解析参数
     */
    parseEvent,

    /**
     * 打开当前页面路径中的参数
     *
     * let { query = {}, scene, ...rest } = options
     * 包含了 query 和 scene 参数，优先级 rest > scene > query
     */
    parseQuery,
  },
})
