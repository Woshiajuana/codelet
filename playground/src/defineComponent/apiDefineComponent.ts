import type {
  ComponentInjectOptions,
  ComponentOptionsBase,
  ComponentOptionsMixin,
  ComponentOptionsWithoutProps,
  ComputedOptions,
  MethodOptions,
} from './componentOptions'
import type {
  ComponentPropsOptions,
  ExtractDefaultPropTypes,
  ExtractPropTypes,
} from './componentProps'
import type { EmitsOptions, EmitsToProps } from './componentEmits'
import type {
  ComponentPublicInstanceConstructor,
  CreateComponentPublicInstance,
} from './componentPublicInstance'
import type { SlotsType } from './componentSlots'

export type PublicProps = Record<string, any>

type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> = Readonly<
  PropsOrPropOptions extends ComponentPropsOptions
    ? ExtractPropTypes<PropsOrPropOptions>
    : PropsOrPropOptions
> &
  ({} extends E ? {} : EmitsToProps<E>)

export type DefineComponent<
  PropsOrPropOptions = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = ComputedOptions,
  M extends MethodOptions = MethodOptions,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  PP = PublicProps,
  Props = ResolveProps<PropsOrPropOptions, E>,
  Defaults = ExtractDefaultPropTypes<PropsOrPropOptions>,
  S extends SlotsType = {},
> = ComponentPublicInstanceConstructor<CreateComponentPublicInstance<D, M, Mixin>> &
  ComponentOptionsBase<Props, RawBindings, D, C, M, Mixin, Extends, E, EE, Defaults, {}, string, S>

export function defineComponent<
  Props = {},
  RawBindings = {},
  D = {},
  C extends ComputedOptions = {},
  M extends MethodOptions = {},
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Extends extends ComponentOptionsMixin = ComponentOptionsMixin,
  E extends EmitsOptions = {},
  EE extends string = string,
  S extends SlotsType = {},
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
  ResolveProps<Props, E>,
  ExtractDefaultPropTypes<Props>,
  S
>
// implementation, close to no-op
/*! #__NO_SIDE_EFFECTS__ */
export function defineComponent(options: unknown) {
  return null as any
}
