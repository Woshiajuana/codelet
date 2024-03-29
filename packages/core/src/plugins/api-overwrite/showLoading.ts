import { isObject, isString } from '@daysnap/utils'

import { definePlugin, promisify } from '../../utils'

type ShowLoadingOptions = WechatMiniprogram.ShowLoadingOption | string

declare module '../../codelet' {
  interface Codelet {
    showLoading<T extends ShowLoadingOptions = ShowLoadingOptions>(
      option?: T,
    ): WechatMiniprogram.PromisifySuccessResult<T, WechatMiniprogram.ShowLoadingOption>
  }
}

/**
 * loading 的时候默认开启 mask
 */
function showLoading(options: string | Parameters<typeof wx.showLoading>[0] = 'loading') {
  if (isString(options)) {
    options = { title: options, mask: true }
  } else if (isObject(options)) {
    options = { mask: true, ...options }
  }
  return promisify(wx.showLoading)(options)
}

export const showLoadingPlugin = definePlugin((col) => {
  ;(col as any)['showLoading'] = showLoading
})
