import { isFunction } from '@daysnap/utils'

import { definePlugin, promisify } from '../utils'

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

type WX = Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

declare module '../codelet' {
  interface Codelet extends WX {}
}

const exclude = [
  'getStorageSync',
  'setStorageSync',
  'removeStorageSync',
  'getStorageInfoSync',
  'clearStorageSync',
  'batchSetStorageSync',
  'batchGetStorageSync',
]

export const apiProxy = definePlugin((col) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (exclude.includes(key)) {
      ;(col as any)[key] = fn.bind(wx)
    } else if (isFunction(fn)) {
      ;(col as any)[key] = promisify(fn).bind(wx)
    } else {
      ;(col as any)[key] = fn
    }
  })
})
