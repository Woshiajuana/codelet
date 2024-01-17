import type { Plugin } from '../types'

export function definePlugin<T extends Plugin>(plugin: T) {
  return plugin
}
