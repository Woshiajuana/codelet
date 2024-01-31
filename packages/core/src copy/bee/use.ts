import type { Plugin } from '../utils'

export function use<Options extends unknown[]>(plugin: Plugin<Options>, ...options: Options) {
  if (typeof plugin === 'function') {
    plugin(this, ...options)
  } else if (plugin.install) {
    plugin.install(this, ...options)
  }
  return this
}
