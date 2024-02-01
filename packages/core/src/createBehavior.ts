import type { DefineOptions, OptionBehavior, Options } from './defineOptions'
import type {
  ComponentPropertyOption,
  DataOptions,
  MethodOptions,
  ComponentLifetimes,
  ComponentOtherOption,
} from './types'

export type BehaviorOptions = Partial<ComponentLifetimes> &
  Partial<Omit<ComponentOtherOption, 'behaviors'>>

export function createBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
>(
  options: Options<Data, Behavior, Method, Property, BehaviorOptions>,
): DefineOptions<Data, Behavior, Method, Property, BehaviorOptions> {
  return Behavior((options as any) ?? {}) as any
}
