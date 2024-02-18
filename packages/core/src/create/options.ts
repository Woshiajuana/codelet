import type { MethodOption, ComponentPropertyOption, DataOption } from './types'

export type OptionBehavior = BehaviorOptionsBase<any, any, any, any>

export type BehaviorOptionsBase<
  Data extends DataOption,
  Behavior extends OptionBehavior,
  Method extends MethodOption = {},
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
  Method extends MethodOption = {},
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

export type BehaviorToOptionTypes<T> = T extends BehaviorOptionsBase<
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
