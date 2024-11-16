import type { Awaitable } from '@daysnap/types'
import { isString } from '@daysnap/utils'

import { definePlugin, getPageByPosition, parseLocation, parseQuery } from '../utils'

declare module '../codelet' {
  interface Codelet {
    useRouter: boolean
    navigateTo(to: Location): Promise<void>
    redirectTo(to: Location): Promise<void>
    reLaunch(to: Location): Promise<void>
    // https://developers.weixin.qq.com/miniprogram/dev/api/route/wx.switchTab.html
    // 需要跳转的 tabBar 页面的路径 (代码包路径)（需在 app.json 的 tabBar 字段定义的页面），路径后不能带参数。
    switchTab(to: Location): Promise<void>
  }
}

export type RouteLocation = {
  url: string
  query?: Record<string, any>
}

export type Location = string | RouteLocation

export interface RouteNext {
  (): void
}

export interface RouterOptions {
  beforeEach?: (to: RouteLocation, from: RouteLocation, next: RouteNext) => Awaitable<void>
  afterEach?: (to: RouteLocation, from: RouteLocation) => Awaitable<void>
}

// 重写路由
export const router = definePlugin((col, options?: RouterOptions) => {
  const { beforeEach, afterEach } = options || {}

  const overwrite = (fn: (options: any) => any) => {
    return async function (location: Location) {
      const to = isString(location) ? { url: location } : location
      const from = getCurrentRoute()

      const next = async () => {
        const options = parseLocation(to)
        await fn(options)
        afterEach?.(to, from)
      }

      if (beforeEach) {
        await beforeEach(to, from, next)
      } else {
        await next()
      }
    }
  }

  // 路由
  Object.assign(col, {
    useRouter: true, // 是否使用路由
    redirectTo: overwrite(col.redirectTo),
    navigateTo: overwrite(col.navigateTo),
    reLaunch: overwrite(col.reLaunch),
    switchTab: overwrite(col.switchTab),
  })
})

function getCurrentRoute() {
  const { route, options } = getPageByPosition()
  const query = parseQuery(options)
  return { url: `/${route}`, query }
}
