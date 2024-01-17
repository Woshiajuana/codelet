import type { Plugin } from '../types'

export function use<Options extends unknown[]>(plugin: Plugin, ...options: Options) {
  if (typeof plugin === 'function') {
    plugin(this, ...options)
  } else if (plugin.install) {
    plugin.install(this, ...options)
  }
  return this
}
