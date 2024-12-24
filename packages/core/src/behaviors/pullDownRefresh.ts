import { sleep } from '@daysnap/utils'

import { createBehavior } from '../create'

export const PullDownRefreshBehavior = createBehavior({
  methods: {
    async onPullDownRefresh() {
      try {
        await this.pullDownRefresh()
        // eslint-disable-next-line no-useless-catch
      } catch (error) {
        throw error
      } finally {
        await sleep(500)
        wx.stopPullDownRefresh()
      }
    },
    async pullDownRefresh() {
      console.warn('需要实现 pullDownRefresh 方法')
    },
  },
})
