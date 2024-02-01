import type { OptionBehavior, Options } from './options'
import type {
  ComponentPropertyOption,
  DataOptions,
  MethodOptions,
  ComponentLifetimes,
  ComponentOtherOption,
} from './types'

export type ComponentOptions = Partial<ComponentLifetimes> &
  Partial<Omit<ComponentOtherOption, 'behaviors'>>

export function createComponent<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
>(options: Options<Data, Behavior, Method, Property, ComponentOptions>) {
  return Component((options as any) ?? {})
}
