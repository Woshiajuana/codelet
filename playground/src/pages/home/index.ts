import './index.json'
import './index.wxml'
import './index.scss'

import col, { createPage } from '@codelet/core'
import { getMainTitle } from '@/utils'
import { xxText } from '@/utils/xxLib'

createPage({
  onLoad() {
    console.log('query => ', getMainTitle('1', '2', '3'), xxText('111'))
  },
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
