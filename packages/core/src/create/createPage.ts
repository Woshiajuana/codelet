import type { OptionBehavior, Options } from './defineOptions'
import type { DataOptions, MethodOptions, PageLifetimes } from './types'

export type PageOptions = Partial<PageLifetimes> & {
  options?: WechatMiniprogram.Component.ComponentOptions
}

export function createPage<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(options: Options<Data, Behavior, Method, {}, PageOptions>) {
  return Page((options as any) ?? {})
}
