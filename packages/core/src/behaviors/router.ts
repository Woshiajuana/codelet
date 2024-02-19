import type { Loose } from '@daysnap/types'
import { isNumber, isString } from '@daysnap/utils'
import { createBehavior } from '../create'
import { bee } from '../bee'
import { ParseBehavior } from './parse'

type RouteOptions = string | Loose<{ url: string; query?: Record<string, any>; replace?: boolean }>

function parseOptions(options: RouteOptions) {
  if (isString(options)) {
    options = { url: options }
  }
  const { url, query = {}, replace = false, ...rest } = options
  return {
    replace,
    url: `${url}?query=${encodeURIComponent(JSON.stringify(query))}`,
    ...rest,
  }
}

export const RouterBehavior = createBehavior({
  behaviors: [ParseBehavior],
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
      const query = this.parseQuery<T>(options)

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
      replace ? bee.redirectTo(rest) : bee.navigateTo(rest)
    },

    /**
     * 跳转第一个页面
     *
     * replace 为 true 时，调用 wx.reLaunch 跳转页面，
     * 否则调用 wx.switchTab，默认为 false
     */
    routerRoot(options: RouteOptions) {
      const { replace, ...rest } = parseOptions(options)
      replace ? bee.reLaunch(rest) : bee.switchTab(rest)
    },

    /**
     * 路由返回
     */
    routerPop(delta = 1) {
      if (!isNumber(delta)) {
        delta = 1
      }
      bee.navigateBack({ delta })
    },
  },
})
