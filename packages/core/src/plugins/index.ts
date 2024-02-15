import { definePlugin } from '../utils'
import { apiOverwrite } from './api-overwrite'
import { apiProxy } from './api-proxy'
import { promise } from './promise'

export * from './api-overwrite'
export * from './api-proxy'
export * from './promise'

// 插件
const plugins = {
  apiProxy,
  promise,
  apiOverwrite,
}

// 启用全部插件
export default definePlugin((bee) => {
  Object.values(plugins).forEach((plugin) => {
    bee.use(plugin)
  })
})
