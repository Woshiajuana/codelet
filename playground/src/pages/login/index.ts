import './index.json'
import './index.wxml'
import './index.scss'

import { clamp } from '@/utils'

Page({
  onLoad() {
    const s1 = clamp(1, 2, 3)
    const s2 = clamp(1, 2, 3)
    console.log('111', s2, s1)
  },
})
