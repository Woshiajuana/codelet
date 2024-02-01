export type DataOptions = Record<string, any>

export interface MethodOptions {
  [key: string]: Function
}

export type OptionMixin = OptionsBase<any, any, any>

export interface OptionsBase<
  Data extends DataOptions,
  Mixin extends OptionMixin,
  Method extends MethodOptions,
> {
  data?: Data
  mixins?: Mixin[]
  methods?: Method
  onLoad?: () => void
  [key: string]: any
}

export type OptionTypesKeys = 'Data' | 'Method'

export type OptionTypesType<Data = {}, Method extends MethodOptions = {}> = {
  Data: Data
  Method: Method
}

export type UnwrapMixinsType<T, Type extends OptionTypesKeys> = T extends OptionTypesType
  ? T[Type]
  : never

type EnsureNonVoid<T> = T extends void ? {} : T

type IsDefaultMixinComponent<T> = T extends OptionMixin
  ? OptionMixin extends T
    ? true
    : false
  : false

export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
  k: infer I,
) => void
  ? I
  : never

type MixinToOptionTypes<T> = T extends OptionsBase<infer Data, infer Mixin, infer Method>
  ? OptionTypesType<Data & {}, Method & {}> & IntersectionMixin<Mixin>
  : never

type ExtractMixin<T> = {
  Mixin: MixinToOptionTypes<T>
}[T extends OptionMixin ? 'Mixin' : never]

export type IntersectionMixin<T> = IsDefaultMixinComponent<T> extends true
  ? OptionTypesType
  : UnionToIntersection<ExtractMixin<T>>

export type OptionsInstance<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  Method extends MethodOptions = {},
  PublicMixin = IntersectionMixin<Mixin>,
  PublicD = UnwrapMixinsType<PublicMixin, 'Data'> & EnsureNonVoid<Data>,
  PublicM extends MethodOptions = UnwrapMixinsType<PublicMixin, 'Method'> & EnsureNonVoid<Method>,
> = PublicM & { data: PublicD }

export type Options<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  Method extends MethodOptions = {},
> = OptionsBase<Data, Mixin, Method> & ThisType<OptionsInstance<Data, Mixin, Method>>

export type DefineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  Method extends MethodOptions = {},
> = { __isFragment: string } & OptionsBase<Data, Mixin, Method>

export function defineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  Method extends MethodOptions = {},
>(options: Options<Data, Mixin, Method>): DefineOptions<Data, Mixin, Method> {
  console.log('options => ', options)
  return null as any
}
