import type { Loose } from '@daysnap/types'
import { formatMessage } from '@daysnap/utils'

export type WithErrorContext = Loose<{
  setData: (data: any) => void
}>

export interface CreateWithOptions {
  /** 格式化错误消息 */
  formatMessage?: (err: unknown) => string

  /** 排除指定错误消息 */
  excludeMessage?: (message: string) => boolean
}

// 默认配置
const defaultOptions: Required<CreateWithOptions> = {
  formatMessage,
  excludeMessage: (message) => !message,
}

export function createWithError(options?: CreateWithOptions) {
  const { formatMessage, excludeMessage } = Object.assign(defaultOptions, options)

  return <T extends (...args: any[]) => Promise<any>>(fn: T) => {
    return async (
      ...params: [...Parameters<T>, WithErrorContext?]
    ): Promise<Awaited<ReturnType<T>>> => {
      let ctx: WithErrorContext | null = null
      if (params.length > fn.length) {
        ctx = params[params.length - 1] as WithErrorContext
        // 为了支持 withLoading
        if ((ctx as any).setData) {
          params.pop()
        }
      }
      try {
        ctx?.setData?.({ error: '' })
        return await fn(...params)
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        const message = formatMessage(error)
        if (!excludeMessage(message)) {
          ctx?.setData?.({ error: message })
        }
        throw error
      }
    }
  }
}
