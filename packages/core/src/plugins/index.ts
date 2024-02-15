import { definePlugin } from '../utils'
import { apiProxy } from './api-proxy'
import { promise } from './promise'
import {} from './api-overwrite'

export * from './api-overwrite'
export * from './api-proxy'
export * from './promise'

// 插件
const plugins = {
  apiProxy,
  promise,
}

// 启用全部插件
export default definePlugin((bee) => {
  Object.values(plugins).forEach((plugin) => {
    bee.use(plugin)
  })
})
