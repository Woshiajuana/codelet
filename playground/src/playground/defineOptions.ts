export type DataOptions = Record<string, any>
export type MethodOptions1 = Record<string, any>

export interface MethodOptions {
  [key: string]: any
}

export type OptionsBase<
  Data extends DataOptions,
  Mixin extends OptionMixin,
  M extends MethodOptions,
> = {
  data?: Data
  mixins?: Mixin[]
} & M

export type OptionMixin = OptionsBase<any, any, any>

export type OptionTypesKeys = 'Data'

export type OptionTypesType<Data = {}> = {
  Data: Data
}

export type UnwrapMixinsType<T, Type extends OptionTypesKeys> = T extends OptionTypesType
  ? T[Type]
  : never

type EnsureNonVoid<T> = T extends void ? {} : T

type UnwrapData<T> 

export type OptionsInstance<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
  PublicD = UnwrapMixinsType<Mixin, 'Data'> & EnsureNonVoid<Data>,
> = M & Data
// &
// PublicD

export type Options<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
> = OptionsBase<Data, Mixin, M> & ThisType<OptionsInstance<Data, Mixin, M>>

export type DefineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
> = OptionsBase<Data, Mixin, M>

export function defineOptions<
  Data extends DataOptions = {},
  Mixin extends OptionMixin = OptionMixin,
  M extends MethodOptions = {},
>(options: Options<Data, Mixin, M>): DefineOptions<Data, Mixin, M> {
  console.log('options => ', options)
  return null as any
}
