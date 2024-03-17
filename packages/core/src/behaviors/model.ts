import { createBehavior } from '../create'
import { parseEvent } from '../utils'

export const ModelBehavior = createBehavior({
  methods: {
    modelTransfer(e: any) {
      const { prop, value, disabled } = parseEvent(e)
      if (disabled) return
      if (prop) {
        this.setData({ [prop]: value })
      }
    },
  },
})
