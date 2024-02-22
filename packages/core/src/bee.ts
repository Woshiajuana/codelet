import type { Plugin } from './utils'

function use<Options extends unknown[]>(this: Bee, plugin: Plugin<Options>, ...options: Options) {
  if (typeof plugin === 'function') {
    plugin(this, ...options)
  } else if (plugin.install) {
    plugin.install(this, ...options)
  }
  return this
}

// declare global {
//   interface Bee {
//     use: typeof use
//   }
// }

export interface Bee {
  use: typeof use
}

export const bee = {
  use,
} as Bee
