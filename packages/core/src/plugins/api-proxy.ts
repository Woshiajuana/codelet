import { definePlugin, promisify } from '../utils'

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

type WX = Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

declare module '../col' {
  interface Bee extends WX {}
}

export const apiProxy = definePlugin((col) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (typeof fn !== 'function') {
      return
    }
    ;(col as any)[key] = promisify(fn).bind(wx)
  })
})
