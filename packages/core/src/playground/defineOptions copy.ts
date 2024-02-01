export type DataOptions = Record<string, any>

export interface MethodOptions {
  [key: string]: Function
}

export type OptionBehavior = OptionsBase<any, any, any>

export type OptionsBase<
  Data extends DataOptions,
  Behavior extends OptionBehavior,
  Method extends MethodOptions,
  Other extends Record<string, any> = {},
> = {
  data?: Data
  behaviors?: Behavior[]
  methods?: Method
  [key: string]: any
} & Other

export type OptionTypesKeys = 'Data' | 'Method'

export type OptionTypesType<Data = {}, Method extends MethodOptions = {}> = {
  Data: Data
  Method: Method
}

export type UnwrapBehaviorsType<T, Type extends OptionTypesKeys> = T extends OptionTypesType
  ? T[Type]
  : never

type EnsureNonVoid<T> = T extends void ? {} : T

type IsDefaultBehaviorComponent<T> = T extends OptionBehavior
  ? OptionBehavior extends T
    ? true
    : false
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type BehaviorToOptionTypes<T> = T extends OptionsBase<infer Data, infer Behavior, infer Method>
  ? OptionTypesType<Data & {}, Method & {}> & IntersectionBehavior<Behavior>
  : never

type ExtractBehavior<T> = {
  Behavior: BehaviorToOptionTypes<T>
}[T extends OptionBehavior ? 'Behavior' : never]

export type IntersectionBehavior<T> = IsDefaultBehaviorComponent<T> extends true
  ? OptionTypesType
  : UnionToIntersection<ExtractBehavior<T>>

export type OptionsInstance<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Other extends Record<string, any> = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicD = UnwrapBehaviorsType<PublicBehavior, 'Data'> & EnsureNonVoid<Data>,
  PublicM extends MethodOptions = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
> = PublicM & { data: PublicD & { [key: string]: any } } & Other

export type Options<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Other extends Record<string, any> = {},
> = OptionsBase<Data, Behavior, Method, Other> &
  ThisType<OptionsInstance<Data, Behavior, Method, Other>>

export type DefineOptions<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Other extends Record<string, any> = {},
> = { __isFragment: string } & OptionsBase<Data, Behavior, Method, Other>

export function defineOptions<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Other extends Record<string, any> = {},
>(options: Options<Data, Behavior, Method, Other>): DefineOptions<Data, Behavior, Method, Other> {
  console.log('options => ', options)
  return null as any
}
