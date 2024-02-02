import type { OptionBehavior, Options } from './options'
import type { DataOptions, MethodOptions, PageInstanceProperties, PageLifetimes } from './types'

export type PageOptions = Partial<PageLifetimes> & {
  options?: WechatMiniprogram.Component.ComponentOptions
}

export function createPage<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(options?: Options<Data, Behavior, Method, {}, PageInstanceProperties> & PageOptions) {
  return Page((options as any) ?? {})
}
