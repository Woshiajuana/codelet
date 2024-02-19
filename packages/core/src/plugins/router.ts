import type { Awaitable } from '@daysnap/types'
import { definePlugin } from '../utils'
import { isString } from '@daysnap/utils'

export interface RouteLocation {
  url: string
  query: Record<string, any>
  replace?: boolean
}

export interface RouterOptions {
  beforeEach?: (to: RouteLocation, from: RouteLocation) => Awaitable<RouteLocation | void>
  afterEach?: (to: RouteLocation, from: RouteLocation) => Awaitable<RouteLocation | void>
}

// 重写路由
export const router = definePlugin((bee, options?: RouterOptions) => {
  const { beforeEach, afterEach } = options
  const next = (location?: RouteLocation) => {}

  // 路由跳转
  async function redirectTo(location: RouteLocation) {
    const { url, query } = location
    const to = { url, query }
    const from = getCurrentRoute()
    await beforeEach?.(to, from)
    wx.redirectTo({})
  }

  // 路由
  Object.assign(bee, { redirectTo })
})

function getCurrentRoute() {
  const pages = getCurrentPages()
  const url = pages[pages.length - 1]
  return { url, query }
}

function parseLocation(location: string | RouteLocation) {
  if (isString(location)) {
    location = { url: location, query: {}, replace: false }
  }
  const { url, query = {}, replace = false, ...rest } = location
  return {
    url: `${url}?query=${encodeURIComponent(JSON.stringify(query))}`,
    ...rest,
  }
}
