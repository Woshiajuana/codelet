import './index.json'
import './index.wxml'
import './index.scss'
import { createPage } from '@bee/core'

// createPage()

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
  behaviors: [a],
  xx() {
    this.data.a
  },
  methods: {
    onLoad(options: any) {
      console.log('Page onLoad => ', options)
    },
    onReady() {
      console.log('Page onReady => ')
    },
  },
  // onLoad(options: any) {
  //   console.log('Page onLoad => ', options)
  // },
  // onReady() {
  //   console.log('Page onReady => ')
  // },
})
