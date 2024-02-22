import type { Awaitable } from '@daysnap/types'
import { isString } from '@daysnap/utils'
import { definePlugin, parseLocation, parseQuery } from '../utils'

// todo 这里的声明合并 这样做不知道是不是最优解
declare module '../bee' {
  interface Bee {
    useRouter: boolean
    navigateTo(to: Location): Promise<void>
    // navigateTo(...args: any): any

    redirectTo(to: Location): Promise<void>
    // redirectTo(...args: any): any

    reLaunch(to: Location): Promise<void>
    // reLaunch(...args: any): any

    switchTab(to: Location): Promise<void>
    // switchTab(...args: any): any
  }
}

export type RouteLocation = {
  url: string
  query: Record<string, any>
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
export const router = definePlugin((bee, options?: RouterOptions) => {
  const { beforeEach, afterEach } = options || {}

  const overwrite = (fn: (options: any) => any) => {
    return async function (location: Location) {
      const to = isString(location) ? { url: location, query: {} } : location
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
  Object.assign(bee, {
    useRouter: true, // 是否使用路由
    redirectTo: overwrite(bee.redirectTo),
    navigateTo: overwrite(bee.navigateTo),
    reLaunch: overwrite(bee.reLaunch),
    switchTab: overwrite(bee.switchTab),
  })
})

function getCurrentRoute() {
  const pages = getCurrentPages()
  const { route, options } = pages[pages.length - 1]
  const query = parseQuery(options)
  return { url: route, query }
}
