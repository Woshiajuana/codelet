import type { Loose } from '@daysnap/types'
import { formatMessage, isFunction, isObject, isString } from '@daysnap/utils'

import { col } from '../codelet'
import { definePlugin } from '../utils'

type ToastCallbackObject = Loose<{
  setData: (data?: Record<string, any>) => void
}>

type ToastCallback =
  | ((err: unknown, message: string) => boolean | void)
  | string
  | ToastCallbackObject

declare global {
  interface Promise<T> {
    toast(cb?: ToastCallback, isThrow?: boolean): Promise<T>
    null(): Promise<T>
    fix(): Promise<T>
  }
}

export interface PromiseOptions {
  /** 格式化错误消息 */
  formatMessage?: (err: unknown) => string

  /** 排除指定错误消息 */
  excludeMessage?: (message: string) => boolean

  /** 默认调用 showToast */
  showToast?: (message: string) => void
}

// 默认配置
const defaultOptions: Required<PromiseOptions> = {
  formatMessage,
  excludeMessage: (message) => !message,
  showToast: (message) => {
    col.showToast({ title: message, icon: 'none' })
  },
}

export const promise = definePlugin((_, options?: PromiseOptions) => {
  const { excludeMessage, formatMessage, showToast } = Object.assign(defaultOptions, options)

  Promise.prototype.toast = async function (cb, isThrow) {
    try {
      return await this
    } catch (err) {
      const message = formatMessage(err)

      if (isFunction(cb) && !cb(err, message)) {
        return
      }

      if (isString(cb)) {
        showToast?.(cb)
      } else if (!excludeMessage(message)) {
        if (isObject(cb)) {
          ;(cb as ToastCallbackObject).setData({ error: message })
        }

        if (isThrow) {
          throw err
        } else {
          showToast?.(message)
        }
      }
    }
  }

  Promise.prototype.null = async function () {
    try {
      return await this
    } catch (err) {
      return console.log(err)
    }
  }
})
