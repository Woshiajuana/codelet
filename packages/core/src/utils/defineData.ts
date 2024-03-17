import { isFunction } from '@daysnap/utils'

export type DefineData<T> = T | (() => T)

/**
 * 小程序是选项式 api ，这个函数主要辅助定义 data 的类型
 * 因此 data 可以定义任何类型 方便后续使用
 */
export function defineData<T = Record<string, any>>(data: DefineData<any> = {}): T {
  return isFunction(data) ? data() : data
}
