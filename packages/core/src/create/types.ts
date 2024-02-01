// 内部数据 用于渲染
export type DataOptions = WechatMiniprogram.Component.DataOption

// 方法
export type MethodOptions = WechatMiniprogram.Component.MethodOption

// 页面生命周期
export type PageLifetimes = WechatMiniprogram.Page.ILifetime

// 组件生命周期
export type ComponentLifetimes = WechatMiniprogram.Component.Lifetimes

// 组件传递的属性 用于渲染
export type ComponentPropertyOption = WechatMiniprogram.Component.PropertyOption

// 转义 Property
export type PropertyOptionToData<P extends ComponentPropertyOption> =
  WechatMiniprogram.Component.PropertyOptionToData<P>

// 组件其他属性
export type ComponentOtherOption = WechatMiniprogram.Component.OtherOption

export type EnsureNonVoid<T> = T extends void ? {} : T

export type InstanceMethods<D extends DataOptions> = WechatMiniprogram.Component.InstanceMethods<D>
