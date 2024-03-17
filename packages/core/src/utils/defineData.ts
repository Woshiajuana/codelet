import { isFunction } from '@daysnap/utils'

export type DefineData<T> = T | (() => T)

export function defineData<T = Record<string, any>>(data: DefineData<T>): T {
  return isFunction(data) ? data() : data
}
