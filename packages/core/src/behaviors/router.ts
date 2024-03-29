import type { Loose } from '@daysnap/types'
import { isNumber } from '@daysnap/utils'

import { col } from '../codelet'
import { createBehavior } from '../create'
import { parseLocation, parseQuery } from '../utils'

type RouteOptions = string | Loose<{ url: string; query?: Record<string, any>; replace?: boolean }>

function parseOptions(options: RouteOptions): any {
  if (col.useRouter) {
    return options
  }
  return parseLocation(options)
}

export const RouterBehavior = createBehavior({
  data: {
    // 页面参数
    query: {} as Record<string, any>,
  },
  methods: {
    /**
     * 获取页面 url 参数
     *
     * let { query = {}, scene, ...rest } = options
     * 包含了 query 和 scene 参数，优先级 rest > scene > query
     */
    routerParseQuery<T extends Record<string, any>>(options: Record<string, any>) {
      const query = parseQuery<T>(options)

      this.setData({ query })

      return query
    },

    /**
     * 页面跳转
     *
     * replace 为 true 时，调用 wx.redirectTo 跳转页面，
     * 否则调用 wx.navigateTo，默认为 false
     */
    routerPush(options: RouteOptions) {
      const { replace, ...rest } = parseOptions(options)
      replace ? col.redirectTo(rest) : col.navigateTo(rest)
    },

    /**
     * 跳转第一个页面
     *
     * replace 为 true 时，调用 wx.reLaunch 跳转页面，
     * 否则调用 wx.switchTab，默认为 false
     */
    routerRoot(options: RouteOptions) {
      const { replace, ...rest } = parseOptions(options)
      replace ? col.reLaunch(rest) : col.switchTab(rest)
    },

    /**
     * 路由返回
     */
    routerPop(delta = 1) {
      if (!isNumber(delta) || delta < 1) {
        delta = 1
      }
      col.navigateBack({ delta })
    },
  },
})
