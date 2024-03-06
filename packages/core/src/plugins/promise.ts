import { formatMessage, isFunction, isString } from '@daysnap/utils'
import { definePlugin } from '../utils'
import { col } from '../col'

type ToastCallback = ((err: unknown, message: string) => boolean | void) | string

declare global {
  interface Promise<T> {
    toast(cb?: ToastCallback): Promise<T>
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

  Promise.prototype.toast = async function (cb) {
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
        showToast?.(message)
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
