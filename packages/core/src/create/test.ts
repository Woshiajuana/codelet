// 用于测试
import { PagingBehavior } from '../behaviors'
import { createApp, createBehavior, createComponent, createPage } from '.'

createApp({
  onLaunch() {
    console.log('onLaunch')
  },
})

Component({
  methods: {
    xx() {},
  },
})

Behavior({
  methods: {
    xx() {},
  },
})

// 行为
const a = createBehavior({
  behaviors: [PagingBehavior],
  data: {
    a: 'a',
  },
  methods: {
    aFn() {
      console.log('aFn')
      return this.data.a
    },
  },
})

const b = createBehavior({
  data: {
    b: 'b',
  },
  methods: {
    bFn() {
      console.log('bFn')
      return this.data.b
    },
  },
})

const d = createBehavior({
  properties: {
    dp: {
      type: String,
      value: 'dp',
    },
  },
  data: {
    d: 'd',
  },
  methods: {
    dFn() {
      this.data.dp
      console.log('dFn')
      return this.data.d
    },
  },
})

const c = createBehavior({
  behaviors: [d],
  properties: {
    cp: {
      type: String,
      value: 'cp',
    },
  },
  data: {
    c: 'c',
  },
  methods: {
    cFn() {
      this.data.d
      this.data.dp
      this.data.cp
      this.data.cxxx
      this.dFn()
      console.log('cFn')
      this.setData({ c: '' })
      return this.data.c
    },
  },
})

// 组件
createComponent({
  behaviors: [a, b, c],
  data: {
    title: 'Hello, World!',
  },
  methods: {
    test() {
      console.log('test')
      this.data.a
      this.data.b
      this.data.c
      this.data.d
      this.data.dp
      this.data.cp
      this.data.e
      this.aFn()
      this.test()
      this.dFn()
      this.setData({ title: 'component Hello, World!' })
    },
  },
})

// 页面
createPage({
  behaviors: [a, b, c],
  data: {
    title: 'Hello, World!',
  },
  test() {
    console.log('test')
    this.data.a
    this.data.b
    this.data.c
    this.data.d
    this.data.dp
    this.data.cp
    this.data.e
    this.aFn()
    this.test()
    this.dFn()
    this.onLoad()
    this.x
    this.setData({ title: 'page Hello, World!' })
  },
  x: 1,
  onLoad() {
    //
  },
})

// Page({
//   behaviors: [a, b, c],
//   data: {
//     title: 'Hello, World!',
//   },
//   x: 1,
//   test() {
//     this.onLoad()
//     this.x
//     console.log('test')
//     this.data.a
//     this.data.b
//     this.data.c
//     this.data.d
//     this.data.dp
//     this.data.cp
//     this.data.e
//     this.aFn()
//     this.test()
//     this.dFn()
//     this.setData({ title: 'page Hello, World!' })
//   },
// })
