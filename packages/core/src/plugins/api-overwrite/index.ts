import { definePlugin } from '../../utils'
import { hideLoadingPlugin } from './hideLoading'
import { showLoadingPlugin } from './showLoading'

export const apiOverwrite = definePlugin((col) => {
  ;[hideLoadingPlugin, showLoadingPlugin].forEach((plugin) => {
    col.use(plugin)
  })
})
