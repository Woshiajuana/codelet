import type {
  DataOptions,
  DefineOptions,
  MethodOptions,
  OptionBehavior,
  Options,
} from './defineOptions'

type BehaviorOptions = Partial<WechatMiniprogram.Component.Lifetimes> &
  Partial<WechatMiniprogram.Component.Property<TProperty>>

export function createBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(
  options: Options<Data, Behavior, Method, BehaviorOptions>,
): DefineOptions<Data, Behavior, Method, BehaviorOptions> {
  return Behavior((options as any) ?? {}) as any
}
