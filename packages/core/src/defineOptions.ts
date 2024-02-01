export type DataOptions = Record<string, any>

export interface MethodOptions {
  [key: string]: Function
}

export type OptionBehavior = OptionsBase<any, any, any>

export interface OptionsBase<
  Data extends DataOptions,
  Behavior extends OptionBehavior,
  Method extends MethodOptions,
> {
  data?: Data
  behaviors?: Behavior[]
  methods?: Method
  onLoad?: () => void
  [key: string]: any
}

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
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicD = UnwrapBehaviorsType<PublicBehavior, 'Data'> & EnsureNonVoid<Data>,
  PublicM extends MethodOptions = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
> = PublicM & { data: PublicD & { [key: string]: any } }

export type Options<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
> = OptionsBase<Data, Behavior, Method> & ThisType<OptionsInstance<Data, Behavior, Method>>

export type DefineOptions<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
> = { __isFragment: string } & OptionsBase<Data, Behavior, Method>

export function defineOptions<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
>(options: Options<Data, Behavior, Method>): DefineOptions<Data, Behavior, Method> {
  console.log('options => ', options)
  return null as any
}
