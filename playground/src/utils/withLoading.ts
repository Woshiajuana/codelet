import col from '@codelet/core'
import { createWithLoading } from '@daysnap/utils'

export type WithLoadingOptions = string | { title: string; mask?: boolean }

// 让一个异步函数具有 loading 的效果
export const withLoading = createWithLoading<WithLoadingOptions>((options) => {
  col.showLoading(options)
  return {
    close: () => col.hideLoading(),
  }
}, 'loading')
