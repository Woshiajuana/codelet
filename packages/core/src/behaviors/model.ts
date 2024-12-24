import { isArray, isFunction } from '@daysnap/utils'

import { createBehavior } from '../create'
import { parseEvent } from '../utils'

export const ModelBehavior = createBehavior({
  methods: {
    modelTransfer(e: any) {
      const { item, ...rest } = parseEvent(e)
      // eslint-disable-next-line prefer-const
      let { prop, value, disabled, pattern, options, valueKey } = Object.assign({}, item, rest)
      if (disabled) return

      if (isArray(options) && value >= 0) {
        const option = options[value]
        if (!option) {
          return
        }
        if (valueKey) {
          value = option[valueKey]
        } else {
          value = option
        }
      }

      if (pattern) {
        if (isFunction(pattern)) {
          value = pattern(value, item?.value)
        } else if ((this as any)[pattern]) {
          value = (this as any)[pattern](value, item?.value)
        }
      }

      if (prop) {
        this.modelBeforeFieldChange(prop, value)
        this.setData({ [prop]: value })
        this.modelAfterFiledChange(prop, value)
      }
    },
    // 以下两个方法是钩子函数，可以覆盖实现
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modelBeforeFieldChange(prop: string, value: any) {
      //
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    modelAfterFiledChange(prop: string, value: any) {
      //
    },
  },
})
