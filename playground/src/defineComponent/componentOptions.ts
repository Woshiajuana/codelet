import type { EmitsOptions, EmitsToProps } from './componentEmits'
import { type CreateComponentPublicInstance } from './componentPublicInstance'
import type { VNodeChild } from './vnode'

declare const RefSymbol: unique symbol

export interface Ref<T = any> {
  value: T
  /**
   * Type differentiator only.
   * We need this to be in public d.ts but don't want it to show up in IDE
   * autocomplete, so we use a private Symbol instead.
   */
  [RefSymbol]: true
}

export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type LooseRequired<T> = { [P in keyof (T & Required<T>)]: T[P] }

export interface ComponentCustomOptions {}

export type RenderFunction = () => VNodeChild

export interface ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  E = any,
  EE = any,
  Defaults = any,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S = any,
> extends LegacyOptions<Props, D, C, M, Mixin, Extends, I, II>,
    ComponentCustomOptions {
  name?: string
  template?: string | object // can be a direct DOM node
  // Note: we are intentionally using the signature-less `Function` type here
  // since any type with signature will cause the whole inference to fail when
  // the return expression contains reference to `this`.
  // Luckily `render()` doesn't need any arguments nor does it care about return
  // type.
  render?: Function
  inheritAttrs?: boolean
}

/**
 * Subset of compiler options that makes sense for the runtime.
 */
export interface RuntimeCompilerOptions {
  isCustomElement?: (tag: string) => boolean
  whitespace?: 'preserve' | 'condense'
  comments?: boolean
  delimiters?: [string, string]
}

export type ComponentOptionsWithoutProps<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = EmitsOptions,
  EE extends string = string,
  I extends ComponentInjectOptions = {},
  II extends string = string,
  S = {},
  PE = Props & EmitsToProps<E>,
> = ComponentOptionsBase<PE, RawBindings, D, C, M, Mixin, Extends, E, EE, {}, I, II, S> & {
  props?: undefined
} & ThisType<
    CreateComponentPublicInstance<PE, RawBindings, D, C, M, Mixin, Extends, E, PE, {}, false, I, S>
  >

export type ComponentOptionsMixin = ComponentOptionsBase<
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>

export type ComputedOptions = Record<string, any>

export interface MethodOptions {
  [key: string]: Function
}

export type ExtractComputedReturns<T> = {
  [key in keyof T]: T[key] extends { get: (...args: any[]) => infer TReturn }
    ? TReturn
    : T[key] extends (...args: any[]) => infer TReturn
      ? TReturn
      : never
}

export type ObjectWatchOptionItem = any

type WatchOptionItem = string | ObjectWatchOptionItem

type ComponentWatchOptionItem = WatchOptionItem | WatchOptionItem[]

type ComponentWatchOptions = Record<string, ComponentWatchOptionItem>

export type ComponentProvideOptions = ObjectProvideOptions | Function

type ObjectProvideOptions = Record<string | symbol, unknown>

export type ComponentInjectOptions = string[] | ObjectInjectOptions

type ObjectInjectOptions = Record<
  string | symbol,
  string | symbol | { from?: string | symbol; default?: unknown }
>

export type InjectToObject<T extends ComponentInjectOptions> = T extends string[]
  ? {
      [K in T[number]]?: unknown
    }
  : T extends ObjectInjectOptions
    ? {
        [K in keyof T]?: unknown
      }
    : never

interface LegacyOptions<
  Props,
  D,
  C extends ComputedOptions,
  M extends MethodOptions,
  Mixin extends ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin,
  I extends ComponentInjectOptions,
  II extends string,
> {
  // allow any custom options
  [key: string]: any

  // state
  // Limitation: we cannot expose RawBindings on the `this` context for data
  // since that leads to some sort of circular inference and breaks ThisType
  // for the entire component.
  data?: (this: any, vm: any) => D
  computed?: C
  methods?: M
  watch?: ComponentWatchOptions
  provide?: ComponentProvideOptions
  inject?: I | II[]

  // assets
  filters?: Record<string, Function>

  // composition
  mixins?: Mixin[]
  extends?: Extends

  // lifecycle
  beforeCreate?(): void
  created?(): void
  beforeMount?(): void
  mounted?(): void
  beforeUpdate?(): void
  updated?(): void
  activated?(): void
  deactivated?(): void
  /** @deprecated use `beforeUnmount` instead */
  beforeDestroy?(): void
  beforeUnmount?(): void
  /** @deprecated use `unmounted` instead */
  destroyed?(): void
  unmounted?(): void

  /**
   * runtime compile only
   * @deprecated use `compilerOptions.delimiters` instead.
   */
  delimiters?: [string, string]

  /**
   * #3468
   *
   * type-only, used to assist Mixin's type inference,
   * typescript will try to simplify the inferred `Mixin` type,
   * with the `__differentiator`, typescript won't be able to combine different mixins,
   * because the `__differentiator` will be different
   */
  __differentiator?: keyof D | keyof C | keyof M
}

export type OptionTypesKeys = 'P' | 'B' | 'D' | 'C' | 'M' | 'Defaults'

export type OptionTypesType<
  P = {},
  B = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Defaults = {},
> = {
  P: P
  B: B
  D: D
  C: C
  M: M
  Defaults: Defaults
}
