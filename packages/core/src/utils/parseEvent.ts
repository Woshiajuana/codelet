import type { Event } from '../create/types'
import { isEvent } from './isEvent'

export function parseEvent(event: Record<string, any> | Event) {
  if (isEvent(event)) {
    const { detail = {}, currentTarget } = event
    const { dataset = {} } = currentTarget || {}
    return {
      ...dataset,
      ...detail,
    }
  }

  return event
}
