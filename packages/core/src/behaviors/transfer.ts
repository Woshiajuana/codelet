import { createBehavior } from '../create'
import { ParseBehavior } from './parse'

export const TransferBehavior = createBehavior({
  behaviors: [ParseBehavior],
  methods: {
    /**
     * 处理点击事件的
     */
    async transfer(e: any) {
      const { item, ...rest } = this.parseEvent(e)
    },
  },
})
