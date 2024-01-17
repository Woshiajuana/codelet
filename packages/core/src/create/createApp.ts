import type { AppOptions } from '../types'

export function createApp(options: AppOptions = {}) {
  console.log('创建 app')
  return App(options)
}
