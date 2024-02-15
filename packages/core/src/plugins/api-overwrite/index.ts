import { definePlugin } from '../../utils'
import { showLoading } from './showLoading'
import { hideLoading } from './hideLoading'

export const apiOverwrite = definePlugin((bee) => {
  Object.entries({
    showLoading,
    hideLoading,
  }).forEach(([key, fn]) => {
    ;(bee as any)[key] = fn
  })
})
