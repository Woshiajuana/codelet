import { createBehavior } from '../create'
import { parseEvent } from '../utils'

export const ModelBehavior = createBehavior({
  methods: {
    modelTransfer(e: any) {
      // eslint-disable-next-line prefer-const
      let { prop, value, disabled, pattern, ...rest } = parseEvent(e)
      if (disabled) return
      if (prop) {
        if (pattern && (this as any)[pattern]) {
          value = (this as any)[pattern](value, { prop, ...rest })
        }
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
