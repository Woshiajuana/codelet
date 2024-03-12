import col, { ParseBehavior, createBehavior } from '@codelet/core'

export const TransferBehavior = createBehavior({
  behaviors: [ParseBehavior],
  methods: {
    /**
     * 处理点击事件的
     */
    async transfer(e: any) {
      const { item, ...rest } = this.parseEvent(e)
      const { url, disabled, query, event, fn } = Object.assign({}, rest, item)

      // 如果是禁用状态，则不处理
      if (disabled) {
        return
      }

      // 跳转页面
      if (url) {
        col.navigateTo({ url, query })
      }

      // 触发自定义事件
      if (event) {
        this.triggerEvent(event, query || item)
      }

      // 执行自定义方法
      if (fn) {
        ;(this as any)[fn](query || item)
      }
    },
  },
})
