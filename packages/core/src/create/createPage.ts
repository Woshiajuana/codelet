import type { PageOptions } from '../types'

export function createPage<T extends PageOptions>(options?: T) {
  console.log('创建 page')
  return Page(options || {})
}
