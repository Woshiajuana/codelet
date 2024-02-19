import { createBehavior } from '../create'

export const TransferBehavior = createBehavior({
  methods: {
    async transfer() {
      //
    },

    /**
     * 转化解析参数
     */
    transferParseEvent(event: WechatMiniprogram.CustomEvent) {
      const { detail = {}, currentTarget } = event
      const { dataset } = currentTarget
      return {
        ...dataset,
        ...detail,
      }
    },
  },
})
