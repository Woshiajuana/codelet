import { definePlugin, promisify } from '../utils'

/**
 * 兼容 wx api promise 写法
 * 使用 bee 自动引入安装
 *  */
export const apiProxy = definePlugin((bee) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (typeof fn !== 'function') {
      return
    }
    ;(bee as any)[key] = promisify(fn).bind(wx)
  })
})
