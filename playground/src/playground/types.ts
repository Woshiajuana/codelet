export type DataOption = Record<string, any>
export type CustomOption = Record<string, any>

export type PageInstance<Data extends DataOption, Custom extends CustomOption> = {
  data: Data
} & Custom

export type Options<Data extends DataOption, Custom extends CustomOption> = {
  mixins?: Options<any, any>
  data: Data
} & Custom &
  ThisType<PageInstance<Data, Custom>>
