import { definePlugin } from '../utils'

interface Location {
  url: string
  query: Record<string, any>
}

export interface RouterOptions {
  beforeEach: (to: Location, from: Location) => void
  afterEach: (to: Location, from: Location) => void
}

// 重写路由
export const router = definePlugin((bee, options: RouterOptions) => {})
