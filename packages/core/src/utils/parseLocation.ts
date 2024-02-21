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
  const { url, query = {}, ...rest } = location
  return {
    url: `${url}?query=${encodeURIComponent(JSON.stringify(query))}`,
    ...rest,
  }
}
