import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'

createPage({
  handleLogin() {
    col.navigateTo({
      url: '/pages/login/index',
      query: {
        id: '123',
      },
    })
  },
  handleGotoActivity() {
    col.navigateTo({
      url: '/packages/activity/pages/home/index',
      query: {
        id: '123',
      },
    })
  },
  handleGotoUser() {
    col.navigateTo({
      url: '/packages/user/pages/home/index',
      query: {
        id: '123',
      },
    })
  },
})
