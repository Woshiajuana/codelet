import type {
  ComponentInjectOptions,
  ComponentOptionsBase,
  ComponentOptionsMixin,
  ComponentOptionsWithoutProps,
  ComputedOptions,
  MethodOptions,
} from './componentOptions'
import type { ExtractDefaultPropTypes } from './componentProps'

export type PublicProps = Record<string, any>

export type DefineComponent<
  PropsOrPropOptions = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E = {},
  EE extends string = string,
  PP = PublicProps,
  Props = any,
  Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>,
  S = {},
> = { __isFragment: string } & ComponentOptionsBase<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  Defaults,
  {},
  string,
  S
>

export function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E = {},
  EE extends string = string,
  S = {},
  I extends ComponentInjectOptions = {},
  II extends string = string,
>(
  options: ComponentOptionsWithoutProps<
    Props,
    RawBindings,
    D,
    C,
    M,
    Mixin,
    Extends,
    E,
    EE,
    I,
    II,
    S
  >,
): DefineComponent<
  Props,
  RawBindings,
  D,
  C,
  M,
  Mixin,
  Extends,
  E,
  EE,
  PublicProps,
  {},
  ExtractDefaultPropTypes<Props>,
  S
>
// implementation, close to no-op
/*! #__NO_SIDE_EFFECTS__ */
export function defineComponent(options: unknown) {
  return null as any
}
