import type { CustomOption, DataOption, Options } from './types'

export function definePage<
  Data extends DataOption,
  Custom extends CustomOption,
  Mixin extends Options<any, any, any>,
>(options: Options<Data, Custom, Mixin>) {
  return null as any
}
