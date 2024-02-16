import { definePlugin } from '../../utils'
import { hideLoadingPlugin } from './hideLoading'
import { showLoadingPlugin } from './showLoading'

export const apiOverwrite = definePlugin((bee) => {
  ;[hideLoadingPlugin, showLoadingPlugin].forEach((plugin) => {
    bee.use(plugin)
  })
})
