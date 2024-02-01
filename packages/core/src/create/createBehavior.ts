import type { DefineOptions, OptionBehavior, Options } from './options'
import type {
  ComponentPropertyOption,
  DataOptions,
  MethodOptions,
  ComponentLifetimes,
  ComponentOtherOption,
} from './types'

export type BehaviorOptions = Partial<ComponentLifetimes> &
  Partial<Omit<ComponentOtherOption, 'behaviors'>>

/**
 * 需要注意 createBehavior 实际返回的是字符串
 * 因为需要支持嵌套的 behaviors 所以类型返回具体的 options
 */
export function createBehavior<
  Data extends DataOptions = {},
  Behavior extends OptionBehavior = OptionBehavior,
  Method extends MethodOptions = {},
  Property extends ComponentPropertyOption = {},
>(
  options: Options<Data, Behavior, Method, Property, BehaviorOptions>,
): DefineOptions<Data, Behavior, Method, Property, BehaviorOptions> {
  return Behavior((options as any) ?? {}) as any
}

createBehavior({
  properties: {
    x: {
      type: String,
      observer() {},
    },
  },
  methods: {
    xxx() {
      this.data.x
    },
  },
})

Behavior({
  properties: {
    x: {
      observer() {},
    },
  },
  methods: {
    xxx() {
      this.setData({})
    },
  },
})
