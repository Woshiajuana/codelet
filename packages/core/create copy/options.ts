import type { Loose, AnyObject } from '@daysnap/types'
import type {
  DataOptions,
  MethodOptions,
  EnsureNonVoid,
  ComponentPropertyOption,
  PropertyOptionToData,
  InstanceMethods,
} from './types'

export type OptionBehavior = OptionsBase<any, any, any, any>

export type OptionsBase<
  Data extends DataOptions,
  Behavior extends OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
> = {
  data?: Data
  behaviors?: Behavior[]
  methods?: Method
  properties?: Property
}

export type OptionTypesKeys = 'Data' | 'Method' | 'Property'

export type OptionTypesType<
  Data = {},
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
> = {
  Data: Data
  Method: Method
  Property: Property
}

export type UnwrapBehaviorsType<T, Type extends OptionTypesKeys> = T extends OptionTypesType
  ? T[Type]
  : never

export type IsDefaultBehaviorComponent<T> = T extends OptionBehavior
  ? OptionBehavior extends T
    ? true
    : false
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

export type BehaviorToOptionTypes<T> = T extends OptionsBase<
  infer Data,
  infer Behavior,
  infer Method,
  infer Property
>
  ? OptionTypesType<Data & {}, Method & {}, Property & {}> & IntersectionBehavior<Behavior>
  : never

export type ExtractBehavior<T> = {
  Behavior: BehaviorToOptionTypes<T>
}[T extends OptionBehavior ? 'Behavior' : never]

export type IntersectionBehavior<T> = IsDefaultBehaviorComponent<T> extends true
  ? OptionTypesType
  : UnionToIntersection<ExtractBehavior<T>>

export type OptionsInstance<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
  CustomInstanceProperty extends AnyObject = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicProperty extends ComponentPropertyOption = UnwrapBehaviorsType<PublicBehavior, 'Property'> &
    EnsureNonVoid<Property>,
  PublicData extends DataOptions = UnwrapBehaviorsType<PublicBehavior, 'Data'> &
    EnsureNonVoid<Data> &
    PropertyOptionToData<PublicProperty>,
  PublicMethod extends MethodOptions = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
> = PublicMethod & { data: Loose<PublicData> } & InstanceMethods<PublicData> &
  CustomInstanceProperty

export type Options<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
  CustomInstanceProperty extends AnyObject = {},
> = OptionsBase<Data, Behavior, Method, Property> &
  ThisType<OptionsInstance<Data, Behavior, Method, Property, CustomInstanceProperty>>
