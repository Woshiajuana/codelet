import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createPage } from '@bee/core'
import { clamp } from '@/utils'

createPage({
  data: {
    xx: '1',
  },
  onLoad() {
    clamp(1, 2, 3)
    console.log('login', bee)
  },
  handleJump() {
    //
  },
})
