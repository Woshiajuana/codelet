import type { Awaitable } from '@daysnap/types'
import { definePlugin, parseLocation, parseQuery } from '../utils'

declare module '../bee' {
  interface Bee {
    useRouter: boolean
    redirectTo(to: RouteLocation): Promise<void>
    navigateTo(to: RouteLocation): Promise<void>
    reLaunch(to: RouteLocation): Promise<void>
    switchTab(to: RouteLocation): Promise<void>
  }
}

export type RouteLocation = {
  url: string
  query: Record<string, any>
}

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
    return async function (to: RouteLocation) {
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
