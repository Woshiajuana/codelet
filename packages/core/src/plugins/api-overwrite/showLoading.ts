import { isString } from '@daysnap/utils'

import { definePlugin, promisify } from '../../utils'

type ShowLoadingOptions = WechatMiniprogram.ShowLoadingOption | string

declare module '../../codelet' {
  interface Codelet {
    showLoading<T extends ShowLoadingOptions = ShowLoadingOptions>(
      option?: T,
    ): WechatMiniprogram.PromisifySuccessResult<T, WechatMiniprogram.ShowLoadingOption>
  }
}

function showLoading(options: string | Parameters<typeof wx.showLoading>[0] = 'loading') {
  if (isString(options)) {
    options = { title: options, mask: true }
  }
  return promisify(wx.showLoading)(options)
}

export const showLoadingPlugin = definePlugin((col) => {
  ;(col as any)['showLoading'] = showLoading
})
