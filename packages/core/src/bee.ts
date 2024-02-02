import type { Plugin } from './utils'

function use<Options extends unknown[]>(this: Bee, plugin: Plugin<Options>, ...options: Options) {
  if (typeof plugin === 'function') {
    plugin(this, ...options)
  } else if (plugin.install) {
    plugin.install(this, ...options)
  }
  return this
}

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

const beeApi = {
  use,
}

export type Bee = typeof beeApi & Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

export const bee = beeApi as Bee
