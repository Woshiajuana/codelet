export type DataOptions = Record<string, any>
export type MethodOptions1 = Record<string, any>

export interface MethodOptions {
  [key: string]: Function
}

export type OptionsBase<
  Data extends DataOptions,
  Mixin extends OptionMixin,
  M extends MethodOptions,
> = {
  data?: Data
  mixins?: Mixin[]
  methods?: M
  [key: string]: any
}

export type OptionMixin = OptionsBase<any, any, any>

export type OptionTypesKeys = 'Data' | 'M'

export type OptionTypesType<Data = {}, M extends MethodOptions = {}> = {
  Data: Data
  M: M
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

type MixinToOptionTypes<T> = T extends OptionsBase<infer Data, infer Mixin, infer M>
  ? OptionTypesType<Data & {}, M & {}> & IntersectionMixin<Mixin>
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
  M extends MethodOptions = {},
  PublicMixin = IntersectionMixin<Mixin>,
  PublicD = UnwrapMixinsType<PublicMixin, 'Data'> & EnsureNonVoid<Data>,
  PublicM extends MethodOptions = UnwrapMixinsType<PublicMixin, 'M'> & EnsureNonVoid<M>,
> = PublicM & PublicD

export type Options<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
> = OptionsBase<Data, Mixin, M> & ThisType<OptionsInstance<Data, Mixin, M>>

export type DefineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
> = { __isFragment: string } & OptionsBase<Data, Mixin, M>

export function defineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
>(options: Options<Data, Mixin, M>): DefineOptions<Data, Mixin, M> {
  console.log('options => ', options)
  return null as any
}
