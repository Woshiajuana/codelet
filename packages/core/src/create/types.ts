// 内部数据 用于渲染
export type DataOption = WechatMiniprogram.Component.DataOption

// 方法
export type MethodOption = WechatMiniprogram.Component.MethodOption

// 组件传递的属性
export type PropertyOption = WechatMiniprogram.Component.PropertyOption

// 页面生命周期
export type PageLifetimes = WechatMiniprogram.Page.ILifetime

// 组件生命周期
export type ComponentLifetimes = WechatMiniprogram.Component.Lifetimes

// 组件其他属性
export type ComponentOtherOption = WechatMiniprogram.Component.OtherOption

// 组件传递的属性 用于渲染
export type ComponentPropertyOption = WechatMiniprogram.Component.PropertyOption

// 转义 Property
export type PropertyOptionToData<P extends ComponentPropertyOption> =
  WechatMiniprogram.Component.PropertyOptionToData<P>

export type ComponentInstanceProperties = WechatMiniprogram.Component.InstanceProperties

export type PageInstanceProperties = WechatMiniprogram.Page.InstanceProperties

export type EnsureNonVoid<T> = T extends void ? {} : T

// page 的属性方法
export type InstanceMethods<D extends DataOption> = WechatMiniprogram.Component.InstanceMethods<D>
