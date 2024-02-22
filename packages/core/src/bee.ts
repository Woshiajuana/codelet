import type { Plugin } from './utils'

function use<Options extends unknown[]>(this: Bee, plugin: Plugin<Options>, ...options: Options) {
  if (typeof plugin === 'function') {
    plugin(this, ...options)
  } else if (plugin.install) {
    plugin.install(this, ...options)
  }
  return this
}

// todo 这里的声明合并 这样做不知道是不是最优解
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export interface Bee {
  use: typeof use
}

export const bee = {
  use,
} as Bee
