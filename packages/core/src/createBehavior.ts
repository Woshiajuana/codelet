import type {
  DataOptions,
  DefineOptions,
  MethodOptions,
  OptionBehavior,
  Options,
} from './defineOptions'

export function createBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(options: Options<Data, Behavior, Method>): DefineOptions<Data, Behavior, Method> {
  return Behavior((options as any) ?? {}) as any
}
