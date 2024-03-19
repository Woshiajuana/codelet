import type { Loose } from '@daysnap/types'

import { mergeOptions } from '../utils'
import type {
  BehaviorOptionsBase,
  IntersectionBehavior,
  OptionBehavior,
  UnwrapBehaviorsType,
} from './options'
import { RuntimeBehavior } from './runtime'
import type {
  ComponentInstanceProperties,
  ComponentLifetimes,
  ComponentOtherOption,
  ComponentPropertyOption,
  DataOption,
  EnsureNonVoid,
  InstanceMethods,
  MethodOption,
  PropertyOptionToData,
} from './types'

export type ComponentOtherOptions = Partial<Omit<ComponentOtherOption, 'behaviors'>>

export type ComponentOptionsInstance<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
  PublicBehavior = IntersectionBehavior<Behavior>,
  PublicProperty extends ComponentPropertyOption = UnwrapBehaviorsType<PublicBehavior, 'Property'> &
    EnsureNonVoid<Property>,
  PublicData extends DataOption = UnwrapBehaviorsType<PublicBehavior, 'Data'> &
    EnsureNonVoid<Data> &
    PropertyOptionToData<PublicProperty>,
  PublicMethod extends MethodOption = UnwrapBehaviorsType<PublicBehavior, 'Method'> &
    EnsureNonVoid<Method>,
> = ComponentInstanceProperties &
  PublicMethod & { data: Loose<PublicData> } & InstanceMethods<PublicData>

export type ComponentOptions<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
> = BehaviorOptionsBase<Data, Behavior, Method, Property> &
  ComponentOtherOptions &
  Partial<ComponentLifetimes> &
  ThisType<ComponentOptionsInstance<Data, Behavior, Method, Property>>

export function createComponent<
  Data extends DataOption = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOption = {},
  Property extends ComponentPropertyOption = {},
>(options?: ComponentOptions<Data, Behavior, Method, Property>) {
  return Component(
    mergeOptions(
      {
        // 注入runtime行为
        behaviors: [RuntimeBehavior],
        options: {
          // 启用多slot支持
          multipleSlots: true,
          // 组件样式隔离
          addGlobalClass: true,
        },
      },
      options,
    ),
  )
}
