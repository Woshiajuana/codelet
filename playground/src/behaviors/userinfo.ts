import type { Userinfo } from '@/types'
import { userinfoStorage } from '@/utils'
import { createBehavior } from '@codelet/core'

export const UserinfoBehavior = createBehavior({
  data: {
    userinfo: '' as Partial<Userinfo> | null,
  },
  methods: {
    /**
     * 获取用户信息
     */
    userinfoGet() {
      const userinfo = userinfoStorage.getItem()
      this.setData({ userinfo })
    },
  },
})
