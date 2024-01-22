import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createPage } from '@bee/core'
import { clamp } from '@/utils'
import { calculate } from '@/mixins'

createPage({
  ...calculate,
  data: {
    xx: '1',
  },
  onLoad() {
    const s = this.data.xx
    this.add(1, 2)
    clamp(1, 2, 3)
    console.log('login', bee)
  },
  handleJump() {
    // console.log('x => ', x)
  },
})
