import type { Loose } from '@daysnap/types'
import type {
  DataOptions,
  MethodOptions,
  EnsureNonVoid,
  ComponentPropertyOption,
  PropertyOptionToData,
} from './types'

export type OptionBehavior = OptionsBase<any, any, any, any>

export type OptionsBase<
  Data extends DataOptions,
  Behavior extends OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
> = Loose<{
  data?: Data
  behaviors?: Behavior[]
  methods?: Method
  properties?: Property
}>

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
  Other extends Record<string, any> = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicD = UnwrapBehaviorsType<PublicBehavior, 'Data'> & EnsureNonVoid<Data>,
  PublicM extends MethodOptions = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
  PublicProperty extends ComponentPropertyOption = UnwrapBehaviorsType<PublicBehavior, 'Property'> &
    EnsureNonVoid<Property>,
> = PublicM & { data: PublicD & PropertyOptionToData<PublicProperty> } & Other

export type Options<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
  Other extends Record<string, any> = {},
> = OptionsBase<Data, Behavior, Method, Property> &
  ThisType<OptionsInstance<Data, Behavior, Method, Property>> &
  Other

export type DefineOptions<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
  Other extends Record<string, any> = {},
> = { __isFragment: string } & OptionsBase<Data, Behavior, Method, Property> & Other
