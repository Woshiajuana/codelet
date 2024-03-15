import type { Event } from '../create/types'

export function parseEvent(event: Event) {
  const { detail = {}, currentTarget, ...rest } = event
  const { dataset = {} } = currentTarget || {}
  return {
    ...rest,
    ...dataset,
    ...detail,
  }
}
