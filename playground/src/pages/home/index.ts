import './index.json'
import './index.wxml'
import './index.scss'

import { sleep } from '@daysnap/utils'
import { createPage } from '@bee/core'

// createPage()

const b = Behavior({
  data: {
    b: 'b',
  },
  lifetimes: {
    attached() {
      console.log('b => ', this.data.b)
    },
  },
  methods: {
    onLoad(options: any) {
      console.log('b onLoad => ', options)
    },
    onReady() {
      console.log('b onReady => ')
    },
  },
})

const a = Behavior({
  data: {
    a: 1,
  },
  lifetimes: {
    attached() {
      console.log('a => ', this.data.a)
    },
  },
  methods: {
    onLoad(options: any) {
      console.log('a onLoad => ', options)
    },
    onReady(xx: any) {
      console.log('a onReady => ', xx)
    },
  },
})

Page({
  behaviors: [a, b],
  xx() {
    this.data.a
  },
  onLoad(options: any) {
    console.log('11')
    this.reqDataList()
  },
  reqDataList() {
    console.xxx('111')
    // await sleep(1000)
    // if (this.data.a) {
    //   throw { xxx: 11 }
    // }
  },
  // methods: {
  //   onLoad(options: any) {
  //     console.log('Page onLoad => ', options)
  //   },
  //   onReady() {
  //     console.log('Page onReady => ')
  //   },
  // },
  // onLoad(options: any) {
  //   console.log('Page onLoad => ', options)
  // },
  // onReady() {
  //   console.log('Page onReady => ')
  // },
})
