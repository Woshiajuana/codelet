export type AppOptions<T extends Record<string, any>> = WechatMiniprogram.App.Options<T>

export function createApp<T extends Record<string, any>>(options?: AppOptions<T>) {
  return App(options ?? {})
}
