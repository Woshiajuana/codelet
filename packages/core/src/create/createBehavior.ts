import type { AnyObject } from '@daysnap/types'
import type { OptionBehavior, Options, OptionsBase } from './options'
import type {
  ComponentPropertyOption,
  DataOptions,
  MethodOptions,
  ComponentLifetimes,
  ComponentOtherOption,
  ComponentInstanceProperties,
} from './types'

export type BehaviorOptions = Partial<ComponentLifetimes> &
  Partial<Omit<ComponentOtherOption, 'behaviors'>>

export type CreateBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
  Other extends AnyObject = {},
> = { __isFragment: string } & OptionsBase<Data, Behavior, Method, Property> & Other

/**
 * 需要注意 createBehavior 实际返回的是字符串
 * 因为需要支持嵌套的 behaviors 所以类型返回具体的 options
 */
export function createBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
>(
  options?: Options<Data, Behavior, Method, Property, ComponentInstanceProperties> &
    BehaviorOptions,
): CreateBehavior<Data, Behavior, Method, Property, BehaviorOptions> {
  return Behavior((options as any) ?? {}) as any
}
