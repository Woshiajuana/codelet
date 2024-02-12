import { definePlugin, promisify } from '../utils'
import '../bee'

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

type WX = Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

export interface Bee extends WX {}

/**
 * 兼容 wx api promise 写法
 * 使用 bee 自动引入安装
 *  */
export const apiProxy = definePlugin((bee) => {
  Object.entries(wx).forEach(([key, fn]) => {
    if (typeof fn !== 'function') {
      return
    }
    ;(bee as any)[key] = promisify(fn).bind(wx)
  })
})
