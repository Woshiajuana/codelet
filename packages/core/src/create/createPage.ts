import type { PageOptions } from '../types'

export function createPage(options: PageOptions = {}) {
  console.log('创建 page')
  return Page(options)
}
