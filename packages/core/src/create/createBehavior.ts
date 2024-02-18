import type { AnyObject, Loose } from '@daysnap/types'
import type {
  IntersectionBehavior,
  UnwrapBehaviorsType,
  OptionBehavior,
  BehaviorOptionsBase,
} from './options'
import type {
  DataOption,
  MethodOption,
  ComponentPropertyOption,
  ComponentOtherOption,
  EnsureNonVoid,
  ComponentInstanceProperties,
  PropertyOptionToData,
  InstanceMethods,
  ComponentLifetimes,
} from './types'

export type BehaviorOtherOption = Partial<Omit<ComponentOtherOption, 'behaviors' | 'options'>>

export type BehaviorOptionsInstance<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicProperty extends ComponentPropertyOption = UnwrapBehaviorsType<PublicBehavior, 'Property'> &
    EnsureNonVoid<Property>,
  PublicData extends DataOption = UnwrapBehaviorsType<PublicBehavior, 'Data'> &
    EnsureNonVoid<Data> &
    PropertyOptionToData<PublicProperty>,
  PublicMethod extends MethodOption = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
> = ComponentInstanceProperties &
  PublicMethod & { data: Loose<PublicData> } & InstanceMethods<PublicData>

export type BehaviorOptions<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
> = BehaviorOptionsBase<Data, Behavior, Method, Property> &
  BehaviorOtherOption &
  Partial<ComponentLifetimes> &
  ThisType<BehaviorOptionsInstance<Data, Behavior, Method, Property>>

export type CreateBehavior<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
  Other extends AnyObject = {},
> = { __isFragment: string } & BehaviorOptionsBase<Data, Behavior, Method, Property> &
  BehaviorOtherOption &
  Partial<ComponentLifetimes> &
  Other

/**
 * 需要注意 createBehavior 实际返回的是字符串
 * 因为需要支持嵌套的 behaviors 所以类型返回具体的 options
 */
export function createBehavior<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
>(
  options?: BehaviorOptions<Data, Behavior, Method, Property>,
): CreateBehavior<Data, Behavior, Method, Property> {
  return Behavior((options as any) ?? {}) as any
}
