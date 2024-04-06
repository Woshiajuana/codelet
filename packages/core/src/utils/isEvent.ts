import { isNumber, isObject, isString } from '@daysnap/utils'

export function isEvent(e: unknown) {
  return isObject(e) && isString((e as any).type) && isNumber((e as any).timeStamp)
}
