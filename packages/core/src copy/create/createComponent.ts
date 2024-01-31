export type ComponentDataOption = WechatMiniprogram.Component.DataOption
export type ComponentPropertyOption = WechatMiniprogram.Component.PropertyOption
export type ComponentMethodOption = WechatMiniprogram.Component.MethodOption
export type ComponentOptions<
  TData extends ComponentDataOption,
  TProperty extends ComponentPropertyOption,
  TMethod extends ComponentMethodOption,
  TCustomInstanceProperty extends Record<string, any> = object,
  TIsPage extends boolean = false,
> = WechatMiniprogram.Component.Options<TData, TProperty, TMethod, TCustomInstanceProperty, TIsPage>

export function createComponent<
  TData extends ComponentDataOption,
  TProperty extends ComponentPropertyOption,
  TMethod extends ComponentMethodOption,
  TCustomInstanceProperty extends Record<string, any> = object,
  TIsPage extends boolean = false,
>(options?: ComponentOptions<TData, TProperty, TMethod, TCustomInstanceProperty, TIsPage>) {
  return Component(options ?? {})
}
