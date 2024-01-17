import type { PageOptions } from './types'

export function createPage(options: PageOptions = {}) {
  return Page(options)
}
