import type { OptionBehavior, Options } from './options'
import type { DataOptions, MethodOptions, PageLifetimes } from './types'

export type PageOptions = Partial<PageLifetimes> & {
  options?: WechatMiniprogram.Component.ComponentOptions
}

export function createPage<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(options: Omit<Options<Data, Behavior, Method, {}, PageOptions>, 'properties'>) {
  return Page((options as any) ?? {})
}
