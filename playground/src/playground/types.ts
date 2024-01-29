export type DataOption = Record<string, any>
export type CustomOption = Record<string, any>

type OptionTypesKeys = 'Data' | 'Mixin'

type OptionTypesType<Data extends DataOption = any, Mixin extends CustomOption = any> = {
  Data: Data
  Mixin: Mixin
}

type UnwrapMixinsType<T, Type extends OptionTypesKeys> = T extends OptionTypesType ? T[Type] : never

export type PageInstance<Data extends DataOption, Custom extends CustomOption> = {
  data: Data
} & Custom

export type Options<
  Data extends DataOption,
  Custom extends CustomOption,
  Mixin extends Options<any, any, any>,
> = {
  mixins?: Mixin[]
  data: Data
} & Custom &
  ThisType<PageInstance<Data & UnwrapMixinsType<Mixin, 'Data'>, Custom>>
