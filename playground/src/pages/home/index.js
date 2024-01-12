import './index.json'
import './index.scss'
import './index.wxml'

import { test } from '@/utils'

Page({
  onLoad() {
    const s = test()
    const data = Object.assign({ s }, { x: '1' })
    console.log('data => ', data)
  },
})
