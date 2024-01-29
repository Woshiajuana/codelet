import type { CustomOption, DataOption, Options, CommonOptions } from './types'

export function definePage<
  Data extends DataOption,
  Custom extends CustomOption,
  Mixin extends CommonOptions,
>(options: Options<Data, Custom, Mixin>) {
  return null as any
}
