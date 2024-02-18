import type { OptionBehavior, Options } from './options'
import type { AnyObject } from '@daysnap/types'
import type { DataOptions, MethodOptions, PageInstanceProperties, PageLifetimes } from './types'

export type PageOptions = Partial<PageLifetimes> & {
  options?: WechatMiniprogram.Component.ComponentOptions
}

export function createPage<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Custom extends AnyObject = {},
>(options?: Options<Data, Behavior, {}, {}, PageInstanceProperties & Custom> & PageOptions) {
  return Page((options as any) ?? {})
}
