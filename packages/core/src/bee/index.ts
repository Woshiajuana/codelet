import { use } from './use'

type GetFunctionKey<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}[keyof T]

const beeApi = {
  use,
}

export type Bee = typeof beeApi & Pick<WechatMiniprogram.Wx, GetFunctionKey<WechatMiniprogram.Wx>>

export const bee = beeApi as Bee
