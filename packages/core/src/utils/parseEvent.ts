import type { Loose } from '@daysnap/types'

export type ParseEvent = Loose<WechatMiniprogram.CustomEvent | WechatMiniprogram.BaseEvent>

export function parseEvent(event: ParseEvent) {
  const { detail = {}, currentTarget, ...rest } = event
  const { dataset = {} } = currentTarget || {}
  return {
    ...rest,
    ...dataset,
    ...detail,
  }
}
