import { definePlugin } from '../utils'
import { apiOverwrite } from './api-overwrite'
import { apiProxy } from './api-proxy'
import { promise, type PromiseOptions } from './promise'
import { router, type RouterOptions } from './router'

export * from './api-overwrite'
export * from './api-proxy'
export * from './promise'
export * from './router'

// 插件
const plugins = {
  apiProxy,
  apiOverwrite,
  promise,
  router,
}

export type PluginConfig = {
  promise?: PromiseOptions
  router?: RouterOptions
}

// 启用全部插件
export default definePlugin((col, options?: PluginConfig) => {
  Object.entries(plugins).forEach(([key, plugin]) => {
    col.use(plugin as any, options?.[key as keyof PluginConfig] as any)
  })
})
