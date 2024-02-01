import type {
  DataOptions,
  DefineOptions,
  MethodOptions,
  OptionMixin,
  Options,
} from './defineOptions'

export function createBehavior<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  Method extends MethodOptions = {},
>(options: Options<Data, Mixin, Method>): DefineOptions<Data, Mixin, Method> {
  return Behavior(options ?? {}) as any
}
