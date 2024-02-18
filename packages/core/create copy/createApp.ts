import type { AnyObject } from '@daysnap/types'

export type AppOptions<T extends AnyObject> = WechatMiniprogram.App.Options<T>

export function createApp<T extends AnyObject>(options?: AppOptions<T>) {
  return App(options ?? {})
}
