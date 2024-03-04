import type { IntersectionBehavior, OptionBehavior, UnwrapBehaviorsType } from './options'
import type { AnyObject, Loose } from '@daysnap/types'
import type {
  ComponentPropertyOption,
  DataOption,
  EnsureNonVoid,
  InstanceMethods,
  PageInstanceProperties,
  PageLifetimes,
  PropertyOptionToData,
} from './types'
import { mergeBehavior } from '../utils/mergeBehavior'
import { RuntimeBehavior } from './runtime'

export type PageOtherOptions = {
  options?: WechatMiniprogram.Component.ComponentOptions
}

export type PageOptionsInstance<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Custom extends AnyObject = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicProperty extends ComponentPropertyOption = UnwrapBehaviorsType<PublicBehavior, 'Property'>,
  PublicData extends DataOption = UnwrapBehaviorsType<PublicBehavior, 'Data'> &
    EnsureNonVoid<Data> &
    PropertyOptionToData<PublicProperty>,
> = Partial<PageLifetimes> &
  PageInstanceProperties &
  UnwrapBehaviorsType<PublicBehavior, 'Method'> & {
    data: Loose<PublicData>
  } & InstanceMethods<PublicData> &
  Custom

export type PageOptions<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Custom extends AnyObject = {},
> = {
  data?: Data
  behaviors?: Behavior[]
} & Custom &
  Partial<PageLifetimes> &
  PageOtherOptions &
  ThisType<PageOptionsInstance<Data, Behavior, Custom>>

export function createPage<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Custom extends AnyObject = {},
>(options?: PageOptions<Data, Behavior, Custom>) {
  return Page(mergeBehavior(options, [RuntimeBehavior]))
}
