import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'
import { UserinfoBehavior } from '@/behaviors'

createPage({
  behaviors: [UserinfoBehavior],
  onShow() {
    this.userinfoGet()
  },
  async handleLogout() {
    const result = await col.showModal({
      title: '温馨提示',
      content: '确定要退出登录吗？',
    })
    if (result.cancel) {
      return
    }
    this.userinfoLogout()
    col.showToast({ title: '退出成功' })
  },
})
