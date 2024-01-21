import './index.json'
import './index.wxml'
import './index.scss'
import bee, { createComponent, createPage } from '@bee/core'
import { clamp } from '@/utils'
import { calculate } from '@/mixins'

Component({
  data: {
    xx: 1,
  },
  methods: {
    xxxx() {
      this.data.xx
    },
  },
})

createComponent({
  data: {
    xx: 1,
  },
  methods: {
    xxxx() {
      this.data.xx
    },
  },
})

Page({
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
