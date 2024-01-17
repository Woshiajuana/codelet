import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createPage } from '@bee/core'
import { clamp } from '@/utils'

createPage({
  onLoad() {
    console.log('xxx', bee)
  },
  handleJump() {
    clamp(1, 2, 3)
    console.log('11')
    wx.navigateTo({
      url: '/pages/login/index',
    })
  },
})
