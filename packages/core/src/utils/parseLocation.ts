import type { Loose } from '@daysnap/types'
import { isString } from '@daysnap/utils'

export function parseLocation(
  location:
    | string
    | Loose<{
        url: string
        query?: Record<string, any>
      }>,
) {
  if (isString(location)) {
    location = { url: location, query: {} }
  }
  // eslint-disable-next-line prefer-const
  let { url, query, ...rest } = location
  if (query) {
    url = `${url}?query=${encodeURIComponent(JSON.stringify(query))}`
  }

  return { url, ...rest }
}
