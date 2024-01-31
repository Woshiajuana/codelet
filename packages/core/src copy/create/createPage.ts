export type PageDataOption = WechatMiniprogram.Page.DataOption
export type PageCustomOption = WechatMiniprogram.Page.CustomOption & {
  mixins?: PageOptions<any, any>
}
export type PageOptions<
  TData extends PageDataOption,
  TCustom extends PageCustomOption,
> = WechatMiniprogram.Page.Options<TData, TCustom>

export function createPage<TData extends PageDataOption, TCustom extends PageCustomOption>(
  options?: PageOptions<TData, TCustom>,
) {
  return Page(options ?? {})
}
