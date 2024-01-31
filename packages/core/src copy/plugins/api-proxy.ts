import { definePlugin, promisify } from '../utils'

export const apiProxy = definePlugin((bee) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (typeof fn !== 'function') {
      return
    }
    ;(bee as any)[key] = promisify(fn).bind(wx)
  })
})
