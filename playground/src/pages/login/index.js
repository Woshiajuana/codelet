import './index.json'
import './index.scss'
import './index.wxml'

import '@/assets/images/icon-logoff.png'

import { test, clamp } from '@/utils'


Page({
  mixins: [],
  onLoad () {
    test()
    const value = clamp(1, 2, 3)
    const value1 = clamp(4, 5, 6)
    console.log('value => ', value)
    console.log('value1 => ', value1)
  }
})