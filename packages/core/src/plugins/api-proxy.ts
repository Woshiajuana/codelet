import { definePlugin, promisify } from '../utils'

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

type WX = Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

declare module '../bee' {
  interface Bee extends WX {}
}

export const apiProxy = definePlugin((bee) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (typeof fn !== 'function') {
      return
    }
    ;(bee as any)[key] = promisify(fn).bind(wx)
  })
})
